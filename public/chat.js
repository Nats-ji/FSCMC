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

var message = document.getElementById('msg');
var firstname = document.getElementById('firstname');
var lastname = document.getElementById('lastname');
var btn_send = document.getElementById('send');
var btn_ready = document.getElementById('ready');
var chatlogdiv = document.getElementById('chatlog');
var s_status = 0;
var s_no = 0;
var chatlog_no = 0;

socket.emit('client_type', 'user');

//Send Message
btn_send.addEventListener('click', function(){
  if (message.value.trim() != '') {
    chatlog_no++;
    socket.emit('input', {
      firstname: firstname.value,
      lastname: lastname.value,
      message: message.value,
      no: chatlog_no
    });
    s_status = 0;
    s_no++;
    message.value = '';
    message.style.height = "27px"
  }
});

$('#msg').keyup(function(event) {
    if (event.keyCode === 13) {
        $('#send').click();
    }
});

//Send realtime message

$('#msg').bind('input propertychange', function() {
  console.log("s_status: " + s_status);
  console.log("Message: " + this.value +" Time: " + Date.now());
  var s_msg = this.value;
  if (s_msg != "") {
    socket.emit('s_input', {
      firstname: firstname.value,
      lastname: lastname.value,
      message: s_msg,
      no: s_no
    }, s_status);
    s_status = 1;
  } else {
    s_status = 0;
    socket.emit('s_input', {
      firstname: firstname.value,
      lastname: lastname.value,
      message: s_msg,
      no: s_no
    }, s_status);

  }

});


//Receive realtime message.
socket.on('s_output', function(data){
  var initials = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase();
  if (data.status == 0) {
    if (data.firstname + data.lastname != firstname.value + lastname.value) {
      if (data.message =="") {
        $('#s_receiver').remove();
      } else {
        chatlogdiv.innerHTML += '<div class = "receiver typing" id = "s_receiver"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div></div>';
      }
/*      chatlogdiv.innerHTML += '<div class = "sender" id = "s_sender"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div></div>';
    } else {*/
    }
  } else {
    if (data.firstname + data.lastname != firstname.value + lastname.value) {
/*      document.getElementById('s_sender').innerHTML = '<div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div>';
    } else {*/
      document.getElementById('s_receiver').innerHTML = '<div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div>';
    }
  }
  chatlogdiv.scrollTop = chatlogdiv.scrollHeight;
});

//Send Readyness Status
btn_ready.addEventListener('click', function(){
  if (firstname.value.trim() == "" || lastname.value.trim() == "") {
    document.getElementById("error").style.display = "block";
  }
  else {
    document.getElementById("nickname-input").style.display = "none";
    document.getElementById("ready-wait").style.display = "block";
    socket.emit('ready_status');
    socket.emit('ready_check');
  }
});

$('#lastname').keyup(function(event) {
    if (event.keyCode === 13) {
        $('#ready').click();
    }
});

//Receive and send messages.
socket.on('output', function(data){
//  console.log(data);
  if (data.length) {
    for (var x = 0; x < data.length; x++) {
      var initials = data[x].firstname.charAt(0).toUpperCase() + data[x].lastname.charAt(0).toUpperCase();
//      console.log(socket.id, data[x].socketid);
      if (data[x].firstname + data[x].lastname == firstname.value + lastname.value) {
        chatlogdiv.innerHTML += '<div class = "sender"><div class = "avatar">' + initials + '</div><div class = "name">' + data[x].firstname + ' ' + data[x].lastname + '</div><div class = "msg">' + data[x].message + '</div><div class = "timestamp">%timeplace holder%</div>';
      } else {
        $('#s_receiver').remove();
        chatlogdiv.innerHTML += '<div class = "receiver"><div class = "avatar">' + initials + '</div><div class = "name">' + data[x].firstname + ' ' + data[x].lastname + '</div><div class = "msg">' + data[x].message + '</div><div class = "timestamp">%timeplace holder%</div>';
      }
      chatlogdiv.scrollTop = chatlogdiv.scrollHeight;
    }
  }
});

//-----------------------------------------------------------------
//Count connections and ready clients.
//To make sure everyone has readied up before the task begins.

var connectionCounter;
var readyCounter;

socket.on('connectionCount', function(data){
  connectionCounter = data;
  document.getElementById('connectionCount').innerHTML = 'Current online user: ' + connectionCounter;
});

socket.on('ready_check', function(data) {
  readyCounter = data;
  document.getElementById('readyCount').innerHTML = readyCounter + ' of ' + connectionCounter + ' people is ready.';
})
//--------------------------------------------------------------------

socket.on('app_start', function(start) {
  if (start == 1) {
    var counter = 5;
    var interval = setInterval(function() {
      counter--;
      // Display 'counter' wherever you want to display it.
      document.getElementById('start-countdown').innerHTML = '<p>Everyone is ready. The task will start in ' + counter + 's.</p>';
      document.getElementById('connections').style.display = "none";
      document.getElementById('ready-wait').style.display = "none";
      if (counter == 0) {
        document.getElementById('login').style.display = "none";
        document.getElementById('container').style.display = "block";
        // Display a login box
        clearInterval(interval);
        socket.emit('app_start', 2);
      }
    }, 1000);
  }
  else {
    document.getElementById('readyCount').innerHTML = readyCounter + ' of ' + connectionCounter + ' people is ready. Need at two users to start.';
  }
})

/*//Input area resizing.
$('#msg').each(function () {
  this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
}).on('input', function () {
  this.style.height = '25px';
  this.style.height = (this.scrollHeight) + 'px';
});*/
//--------------------------------------------------------------------

//This is for task image box size controll.

function winSize() {
  var winWidth = $(window).width();
  if (winWidth > 1600) {
    document.getElementById('task-window').style.width = "1100px";
    document.getElementById('chat-window').style.width = winWidth - 1110 + "px";
  }
  else {
    document.getElementById('task-window').style.width = winWidth * 2 / 3 +"px";
    document.getElementById('chat-window').style.width = winWidth / 3 - 10 + "px";
  }
}
window.onload = winSize;
window.onresize = winSize;

//Receive task image
socket.on('task_image', function(number) {
  if (number == 1) {
    document.getElementById('task-img').src='/image/spot-diff-1.png';
  }
  else if (number == 2) {
    document.getElementById('task-img').src='/image/spot-diff-2.png';
  }
  else {
    alert("Something is wrong");
  }
});
