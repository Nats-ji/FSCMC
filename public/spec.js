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

var socket = io.connect("http://localhost");
//var socket = io.connect("http://178.128.88.108:80"); //For Server
var chatlogdiv1 = document.getElementById('chatlog1');
var chatlogdiv2 = document.getElementById('chatlog2');
var message1 = document.getElementById('msg1');
var message2 = document.getElementById('msg2');

socket.emit('client_type', 'spec');

socket.on('spec_output',function(data) {
  if (data.socketid == data.user1_id) {
    var initials = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase();
    $('#s_receiver2').remove();
    message1.value = "";
    chatlogdiv1.innerHTML += '<div class = "sender"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div><div class = "timestamp">%timeplace holder%</div>';
    chatlogdiv2.innerHTML += '<div class = "receiver"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div><div class = "timestamp">%timeplace holder%</div>';
    chatlogdiv1.scrollTop = chatlogdiv1.scrollHeight;
    chatlogdiv2.scrollTop = chatlogdiv2.scrollHeight;
  } else {
    var initials = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase();
    $('#s_receiver1').remove();
    message2.value = "";
    chatlogdiv1.innerHTML += '<div class = "receiver"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div><div class = "timestamp">%timeplace holder%</div>';
    chatlogdiv2.innerHTML += '<div class = "sender"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div><div class = "timestamp">%timeplace holder%</div>';
    chatlogdiv2.scrollTop = chatlogdiv2.scrollHeight;
  }
});

socket.on('spec_s_output',function(data) {
  if (data.socketid == data.user1_id) {
    var initials = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase();
    message1.value = data.message;
    if (data.status == 0) {
      if (data.message !="") {
        chatlogdiv2.innerHTML += '<div class = "receiver typing" id = "s_receiver2"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div></div>';
        chatlogdiv2.scrollTop = chatlogdiv2.scrollHeight;
      } else {
        $('#s_receiver2').remove();
      }
    } else {
      document.getElementById('s_receiver2').innerHTML = '<div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div>';
    }
  } else {
    var initials = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase();
    message2.value = data.message;
    if (data.status == 0) {
      if (data.message != "") {
        chatlogdiv1.innerHTML += '<div class = "receiver typing" id = "s_receiver1"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div></div>';
        chatlogdiv1.scrollTop = chatlogdiv1.scrollHeight;
      } else {
        $('#s_receiver1').remove();
      }
    } else {
      document.getElementById('s_receiver1').innerHTML = '<div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div>';
    }
  }
});
