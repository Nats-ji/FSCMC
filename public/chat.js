var socket = io.connect("http://localhost");

var message = document.getElementById('msg');
    firstname = document.getElementById('firstname');
    lastname = document.getElementById('lastname');
    btn_send = document.getElementById('send');
    btn_ready = document.getElementById('ready');
    chatlogdiv = document.getElementById('chatlog');
    s_status = 0;

//Send Message
btn_send.addEventListener('click', function(){
  if (message.value.trim() != '') {
    socket.emit('input', {
      firstname: firstname.value,
      lastname: lastname.value,
      message: message.value,
      time: Date.now()
    });
    s_status = 0;
    message.value = '';
    document.getElementById('msg').style.height = "27px"
  }
});

//Send realtime message

$('#msg').bind('input propertychange', function() {
  console.log("s_status: " + s_status);
  console.log("Message: " + this.value +" Time: " + Date.now());
  var s_msg = this.value;
  socket.emit('s_input', {
    firstname: firstname.value,
    lastname: lastname.value,
    message: s_msg,
    time: Date.now()
  }, s_status);
  s_status = 1;
});
//Send session information.



//Receive realtime message.
socket.on('s_output', function(data){
  var initials = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase();
  if (data.status == 0) {
    if (data.firstname + data.lastname == firstname.value + lastname.value) {
      chatlogdiv.innerHTML += '<div class = "sender" id = "s_sender"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div></div>';
    } else {
      chatlogdiv.innerHTML += '<div class = "receiver" id = "s_receiver"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div></div>';
    }
  } else {
    if (data.firstname + data.lastname == firstname.value + lastname.value) {
      document.getElementById('s_sender').innerHTML = '<div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div>';
    } else {
      document.getElementById('s_receiver').innerHTML = '<div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + '</div><div class = "msg">' + data.message + '</div>';
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
//Receive and send messages.
socket.on('output', function(data){
//  console.log(data);
  if (data.length) {
    for (var x = 0; x < data.length; x++) {
      var initials = data[x].firstname.charAt(0).toUpperCase() + data[x].lastname.charAt(0).toUpperCase();
//      console.log(socket.id, data[x].socketid);
      if (data[x].firstname + data[x].lastname == firstname.value + lastname.value) {
        $('#s_sender').remove();
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

//Input area resizing.
$('#msg').each(function () {
  this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
}).on('input', function () {
  this.style.height = '25px';
  this.style.height = (this.scrollHeight) + 'px';
});
//--------------------------------------------------------------------
