var socket = io.connect("http://localhost");
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
    if (data.status == 0) {
      message1.value = data.message;
      chatlogdiv2.innerHTML += '<div class = "receiver typing" id = "s_receiver2"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div></div>';
      chatlogdiv2.scrollTop = chatlogdiv2.scrollHeight;
    } else {
      message1.value = data.message;
      document.getElementById('s_receiver2').innerHTML = '<div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div>';
    }
  } else {
    var initials = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase();
    if (data.status == 0) {
      message2.value = data.message;
      chatlogdiv1.innerHTML += '<div class = "receiver typing" id = "s_receiver1"><div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div></div>';
      chatlogdiv1.scrollTop = chatlogdiv1.scrollHeight;
    } else {
      message2.value = data.message;
      document.getElementById('s_receiver1').innerHTML = '<div class = "avatar">' + initials + '</div><div class = "name">' + data.firstname + ' ' + data.lastname + ' (Typing...)</div><div class = "msg">' + data.message + '</div>';
    }
  }
});
