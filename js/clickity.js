var input = $('#input'),
    buffer = $('#buffer'),
    num = $('#num'),
    result = $('#result'),
    preButton = $('.pre-btn');

var colorPalette = [];
var clickButton = document.getElementById('theButton');

var clickStream = Rx.Observable.fromEvent(clickButton, 'click');
var bufferedClickStream = clickStream.buffer(clickStream.throttle(300));
var numberStream = bufferedClickStream
  .map(function(clickList) {
    return clickList.length;
  });
var resultStream = numberStream
  .filter(function(x) {
    return x >= 2
  })
  .map(function(x) {
    return x;
  });
var preStream = Rx.Observable.fromEvent(preButton, 'click')
  .map(function(e){
    return e.target;
  });

function addedToArray() {
  newObjects.push(this);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function randomColor() {
  var output = '#';
  for (var i = 0; i < 3; i++) {
    var tempRandom = Math.floor(Math.random() * 255);
    output += componentToHex(tempRandom);
  }
  return output;
}

preStream.subscribe(function(obj) {
    var target = $(obj).attr('href');
    $(target).slideToggle();
  });
clickStream.subscribe(function(click) {
  // The pure JS way!!!
  var clickContainer = document.createElement('div');
  var clickSpan = document.createElement('span');
  var clickText = document.createTextNode(' ');
  var chosenColor = randomColor();

  clickSpan.className = 'click';
  clickSpan.style.backgroundColor = chosenColor;
  clickSpan.appendChild(clickText);

  // Fill the palette
  colorPalette.push({color: chosenColor, time: click.timeStamp});

  clickContainer.className = 'click-container';
  clickContainer.appendChild(clickSpan);

  input.append(clickContainer);
});
bufferedClickStream.subscribe(function(clicks) {
  var clickContainer = document.createElement('div');
  clickContainer.className = 'click-container multi';

  for (var i = 0; i < clicks.length; i++) {
    var clickSpan = document.createElement('span');
    clickSpan.className = 'click';

    // Find the corresponding color!
    colorPalette
      .filter(function(color) {
        return color.time === clicks[i].timeStamp;
      })
      .map(function(color) {
        clickSpan.style.backgroundColor = color.color;
      });

    clickContainer.appendChild(clickSpan);
  }

  buffer.append(clickContainer);
});
numberStream.subscribe(function(clicks) {
  var clickSpan = document.createElement('span');
  var clickSpanText = document.createTextNode(clicks);
  var clickContainer = document.createElement('div');

  clickSpan.className = 'click';
  clickSpan.appendChild(clickSpanText);

  clickContainer.className = 'click-container';
  clickContainer.appendChild(clickSpan);

  num.append(clickContainer);
});
resultStream.subscribe(function(clicks) {
  var clickSpan = document.createElement('span');
  var clickSpanText = document.createTextNode(clicks);
  var clickContainer = document.createElement('div');

  clickSpan.className = 'click';
  clickSpan.appendChild(clickSpanText);

  clickContainer.className = 'click-container';
  clickContainer.appendChild(clickSpan);

  result.append(clickContainer);
});
