/*
Copyright 2018-2020 Mingming Cui

This file is part of FSCMC.

FSCMC is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

FSCMC is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <https://www.gnu.org/licenses/>.
*/
require('dotenv').config();
var express = require('express');
var socket = require('socket.io');
var mongo = require('mongodb').MongoClient;

const mongodburl = process.env.MONGODB;
const port = process.env.PORT;

var app = express();
var server = app.listen(port,function(){
  console.log('listening to requests on port ' + port)
});

app.use(express.static('public'));

var io = socket(server);
var connectionCounter = 0;
var client_status = [];
var s_order = 0; //Overall order for typelog;
var overall_order = 0; //Overall order for chatlog;
//Connect to mongodb.
mongo.connect(mongodburl, function(err,client) {
  if (err) {
    throw err;
  };
  console.log('MongoDB connected.');

  var db = client.db('SCMC')
  var session_info = db.collection('session_info');
  var chatlog;
  var typelog;
  var spec_id;
  var user1_id;
  var user2_id;

  io.on('connection',function(socket){
    socket.on('client_type',function(client_type){
      if (client_type == 'user') {
        connectionCounter ++;
        client_status.push([socket.id, 0]);
      } else {
        spec_id = socket.id;
      }
      console.log(client_type, spec_id);
      console.log(socket.id, 'made socket connection. Current connections:', connectionCounter);
      console.log(client_status.toString());

      io.sockets.emit('connectionCount', connectionCounter);
      socket.on('disconnect', function() {
        for (var i = 0; j = client_status.length, i < j; i ++) {
          if (client_status[i][0] == socket.id) {
            client_status.splice(i, 1);
          }
        };
        if (socket.id != spec_id) {
          connectionCounter --;
        };
        s_order = 0;
        overall_order = 0;
        console.log(socket.id, 'has disconnected. Current connections:', connectionCounter);
        console.log(client_status.toString());
        io.sockets.emit('connectionCount', connectionCounter);
      });

      socket.on('ready_status',function() {
        for (var i = 0; j = client_status.length, i < j; i++) {
          if (client_status[i][0] == socket.id) {
            client_status[i][1] = 1;
            console.log(socket.id, "is ready.")
          };
        }
      })

      //var sessionid = 0;

      socket.on('ready_check', function() {
        var readyCounter = 0;
        for (var i = 0; j = client_status.length, i < j; i++) {
          if (client_status[i][1] == 1) {
            readyCounter++;
          };
        }
        io.sockets.emit('ready_check', readyCounter);
        if (readyCounter == connectionCounter && connectionCounter > 1) {//BUg here
          user1_id = client_status[0][0];
          user2_id = client_status[1][0];
          io.sockets.emit('app_start', 1);
          //Distribute task image
          io.to(user1_id).emit('task_image', '1');
          io.to(user2_id).emit('task_image', '2');
          session_info.count(function (err, count) {
              //Insert session information into MongoDB
              let sessionid = count + 1;
              console.log("session_id is " + sessionid);
              chatlog = db.collection('chatlog'+sessionid);
              typelog = db.collection('typelog'+sessionid);
  /*            socket.on('session_info', function(socketid, firstname, lastname) {
                var socketids = [];
                var firstnames = [];
                var lastnames = [];
                socketids.push(socketid); firstnames.push(firstname); lastnames.push(lastname);*/
              session_info.insert({sessionid: sessionid});
              //})
          })

          //console.log("Everyone is ready! Session ID is " + sessionid);
        }
        else {
          io.sockets.emit('app_start', 0);
          console.log("Everyone is ready, but waiting on more user.")
        }
      })

      socket.on('app_start', function(status) {
        if (status == 2) {

          //Begin Chat session


          //Load Chatlogs for mongodb (bug)
  /*        chatlog.find().limit(100).sort({_id:1}).toArray(function(err, res) {
            if (err) {
              throw err;
            }
            io.sockets.emit('output', res);
            console.log('Sending chatlogs from database!');
          });
  */

          //Receive Message
          socket.on('input', function(data){
            console.log("New message from ", socket.id, '. Message: ', data.firstname, data.lastname, ': ', data.message, ' Timestamp: ', Date.now());
            let firstname = data.firstname;
            let lastname = data.lastname;
            let message = data.message;
            let time = Date.now();
            let sender_order = data.no;
            overall_order++;

            //Insert message to MongoDB
            chatlog.insert({socketid: socket.id, firstname: firstname, lastname: lastname,message: message, time: time, overall_order: overall_order, sender_order: sender_order}, function() {
              io.sockets.emit('output', [data]);
              io.to(spec_id).emit('spec_output', {user1_id: user1_id, user2_id: user2_id, socketid: socket.id, firstname: firstname, lastname: lastname,message: message, time: time, overall_order: overall_order, sender_order: sender_order});
            });
          });

          //Receive realtime message
          socket.on('s_input', function(data,status){
            console.log("New realtime message!" + status);
            s_order++;
            let s_firstname = data.firstname;
            let s_lastname = data.lastname;
            let s_message = data.message;
            let s_status = status;
            let s_time = Date.now();
            let s_no = data.no;
            typelog.insert({socketid: socket.id, firstname: s_firstname, lastname: s_lastname,message: s_message, time: s_time, status: s_status, overall_order: s_order, sender_order: s_no}, function() {
              io.sockets.emit('s_output', {socketid: socket.id, firstname: s_firstname, lastname: s_lastname,message: s_message, time: s_time, status: s_status});
              io.to(spec_id).emit('spec_s_output', {user1_id: user1_id, user2_id: user2_id, socketid: socket.id, firstname: s_firstname, lastname: s_lastname,message: s_message, time: s_time, status: s_status});
            });

        //    io.sockets.emit('s_output', {firstname: s_firstname, lastname: s_lastname, message: s_message}, s_status);
          });
        }
      })
    })
  });
});
