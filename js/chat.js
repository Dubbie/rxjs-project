var chooser = $('#chat-name-chooser');
var chatWindow = $('.chat-window');
var sendButton = $('#send');
var sender = $('.chat-sender');
var colorChooserButton = $('.color-btn');
var yourNameHolder = $('#chat-yourname');
var colorSquare = $('.chat-colorsquare');
var chatList = $('.chat-list');
var chatUsers = $('.chat-users');
var moreMessages = $('.more-messages');

// Other data ------------------------------------------------

var timeout = null;
var data = [];
var dataLength = 0;
var users = [];

// Functions -------------------------------------------------

function scrollChat(lineHeight) {
  var _newHeight = chatList[0].scrollHeight;
  var _oldHeight = _newHeight - lineHeight;
  var _curHeight = Math.floor(chatList.outerHeight() + chatList.scrollTop());
  var _diff = _newHeight - _curHeight;

  if (_diff <= lineHeight) {
    chatList.scrollTop(_oldHeight);
    moreMessages.removeClass('is-scrolled');
  } else {
    moreMessages.addClass('is-scrolled');
  }
}
function createMessage(line) {
  var _userName = line.username;
  var _color = '#' + line.color;
  var _timeStamp = line.timeStamp;
  var _shortTimeStamp = line.shortTimeStamp;
  var _message = line.message;

  var holder = document.createElement('li');

  var timeStamp = document.createElement('span');
  var timeStampText = document.createTextNode(_shortTimeStamp);

  var userName = document.createElement('span');
  var userNameText = document.createTextNode(_userName);

  var message = document.createElement('span');
  var messageText = document.createTextNode(_message);

  holder.className = 'chat-line';

  timeStamp.className = 'chat-timestamp';
  timeStamp.setAttribute('data-timestamp', _timeStamp);
  timeStamp.appendChild(timeStampText);

  userName.className = 'chat-username';
  userName.setAttribute('data-username', _userName);
  userName.appendChild(userNameText);
  userName.style.color = _color;

  message.className = 'chat-message';
  message.setAttribute('data-message', _message);
  message.appendChild(messageText);

  holder.appendChild(timeStamp);
  holder.appendChild(userName);
  holder.appendChild(message);

  // Get the line height -> pass it to scroll function
  var _tO = chatList[0].scrollHeight;
  chatList.append(holder);
  var _d = chatList[0].scrollHeight - _tO;
  scrollChat(_d);
  data.push(line.message);
}
function createUser(userName, color, holder) {
  var userHolder = document.createElement('li');
  var userNameHolder = document.createElement('span');
  var userNameText = document.createTextNode(userName);

  userHolder.className = 'chat-users-user';

  userNameHolder.className = 'chat-username';
  userNameHolder.setAttribute('data-username', userName);
  userNameHolder.style.color = '#' + color;

  userNameHolder.appendChild(userNameText);
  userHolder.appendChild(userNameHolder);

  holder.append(userHolder);
}
function removeUser(userName, holder) {
  holder.find('span[data-username=' + userName + ']').parents('li').remove();
}
function setColor(color) {
  $.ajax({
    method: 'post',
    url: '/react/set/color.php',
    data: {color: color},
    dataType: 'json',
    success: function(response) {
      if (response.success === true) {
        var _color = response.activeColor;
        $('.chat-username[data-username=' + response.username + ']').css('color', _color);
      }
    }
  });
}
function restartTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    chatWindow.addClass('inactive');
    chooser.slideDown(250);
  }, 300000);
}

// User logging ----------------------------------------------

sender.submit(function(e) {
  e.preventDefault();
});
chooser.submit(function(e) {
  e.preventDefault();
});

var chStream = Rx.Observable.fromEvent(chooser,'submit')
  .startWith('initialise');
var sendStream = Rx.Observable.fromEvent(sender, 'submit');

chStream.subscribe(function() {
  // Check username
  $.ajax({
    url: 'fetch/uname.php',
    method: 'post',
    data: chooser.serialize(),
    dataType: 'json',
    success: function(response) {
      if (response.success === true) {
        chatWindow.removeClass('inactive');
        chooser.slideUp(250);
        restartTimer();

        if (response.hasOwnProperty('data')) {
          var _username = response.data.username;
          var _color = response.data.color;

          yourNameHolder.text(_username);
          yourNameHolder.css('color', _color);
        }
      } else if (response.success === false) {
        console.log('User not logged in');
      }
    }
  });

  return 'user changed';
});
sendStream.subscribe(function() {
  // Send to server
  $.ajax({
    url: 'set/message.php',
    method: 'post',
    data: sender.serialize(),
    dataType: 'json',
    success: function(response) {
      if (response.success === true) {
        createMessage(response.data);
      }
    }
  });
  sender[0].reset();
});

// Data sutff  ----------------------------------------------

var dataStream = Rx.Observable.interval(5000)
  .startWith('init')
  .flatMap(function() {
    return Rx.Observable.fromPromise($.getJSON('fetch/messages.php'));
  });
var userTimerStream = Rx.Observable.interval(5000)
  .startWith('initialise');
var userStream = Rx.Observable.merge(
    chStream, userTimerStream
  );
var responseStream = userStream.flatMap(function() {
  return Rx.Observable.fromPromise($.getJSON('fetch/users.php'));
});
var colorHolderStream = Rx.Observable.fromEvent(colorChooserButton, 'click');
var colorStream = Rx.Observable.fromEvent(colorSquare, 'click')
  .map(function(e) {
    var a = $(e.target).css('backgroundColor').split("(")[1].split(")")[0];
    a = a.split(',');

    var b = a.map(function(x){
      x = parseInt(x).toString(16);
      return (x.length==1) ? '0' + x : x;
    });

    b = b.join('');
    return [b,e];
  });
var moreStream = Rx.Observable.fromEvent(moreMessages, 'click');
var metaStream = Rx.Observable.merge(
  sendStream, colorStream, moreStream
);

// Render ----------------------------------------------------

dataStream.subscribe(function(response) {
  if (response.success === true) {
    var _data = response.data;

    _data.map(function(line) {
      if($.inArray(line.message, data) === -1) {
        createMessage(line);
      }
    });
  } else {
    console.log('Error!');
  }
});
responseStream.subscribe(function(response) {
  var _data = response.data;
  var _users = response.data.map(function(user) { return user.username});

  _data.forEach(function(_user) {
    if ($.inArray(_user.username, users) === -1) {
      users.push(_user.username);
      createUser(_user.username, _user.color, chatUsers);
    } else {
      // TODO
    }
  });
  users.forEach(function(username) {
    if ($.inArray(username, _users) === -1) {
      var index = users.indexOf(username);
      users.splice(index, 1);
      removeUser(username, chatUsers);
    } else {
      // TODO
    }
  });
});
colorHolderStream.subscribe(function() {
  var container = $('.chat-colorchooser');
  container.toggleClass('is-active');
});
colorStream.subscribe(function(arr) {
  var _color = arr[0];
  var _event = arr[1];

  setColor(_color);
  $(_event.target).siblings().removeClass('is-active');
  $(_event.target).addClass('is-active');
});
moreStream.subscribe(function() {
  chatList.scrollTop(chatList[0].scrollHeight);
  moreMessages.removeClass('is-scrolled');
});
metaStream.subscribe(function() {
  restartTimer();
});
