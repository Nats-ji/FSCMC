var express = require('express');
var socket = require('socket.io');
var mongo = require('mongodb').MongoClient;


var app = express();
var server = app.listen(80,function(){
  console.log('listening to requests on port 80')
});

app.use(express.static('public'));

var io = socket(server);
var connectionCounter = 0;
var client_status = [];

//Connect to mongodb.
mongo.connect('mongodb://127.0.0.1:27017/SCMC', function(err,client) {
  if (err) {
    throw err;
  };
  console.log('MongoDB connected.');
  io.on('connection',function(socket){
    connectionCounter ++;
    client_status.push([socket.id, 0]);
    console.log(socket.id, 'made socket connection. Current connections:', connectionCounter);
    console.log(client_status.toString());
    io.sockets.emit('connectionCount', connectionCounter);

    socket.on('disconnect', function() {
      for (var i = 0; j = client_status.length, i < j; i ++) {
        if (client_status[i][0] == socket.id) {
          client_status.splice(i, 1);
        }
      };
      connectionCounter --;
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
        io.sockets.emit('app_start', 1);
  //      sessionid = parseInt(Math.random() * 100000000000 + 1);
  //      console.log("Everyone is ready! Session ID is " + sessionid);
      }
      else {
        io.sockets.emit('app_start', 0);
        console.log("Everyone is ready, but waiting on more user.")
      }
    })

    socket.on('app_start', function(status) {
      if (status == 2) {

        //Begin Chat session
        var db = client.db('SCMC')
        var chatlog = db.collection('chatlog');

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
          console.log("New message from ", socket.id, '. Message: ', data.firstname, data.lastname, ': ', data.message, ' Timestamp: ', data.time);
          let firstname = data.firstname;
          let lastname = data.lastname;
          let message = data.message;
          let time = data.time;

          //Insert message to MongoDB
          chatlog.insert({socketid: socket.id, firstname: firstname, lastname: lastname,message: message, time: time}, function() {
            io.sockets.emit('output', [data]);
          });
        });

        //Receive realtime message
        socket.on('s_input', function(data,status){
          console.log("New realtime message!" + status);
          let s_firstname = data.firstname;
          let s_lastname = data.lastname;
          let s_message = data.message;
          let s_status = status;
          io.sockets.emit('s_output', {firstname: s_firstname, lastname: s_lastname, message: s_message}, s_status);
        });
      }
    })
  });
});
