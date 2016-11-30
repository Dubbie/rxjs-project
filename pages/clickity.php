<article class="box">
  <div class="box-content">
    <span class="box-title">Multiple clicks</span>
    <p>How would you go about registering multiple clicks? Let me show you a very quick way, you don't even have to store the clicks!</p>
  </div>
</article>
<span class="modal-title text-center">How it works</span>
<div id="timeline" class="box">
  <div class="box-content">
    <h4>Unfiltered input</h4>
    <div id="input" class="click-flex"></div>
    <h4>Buffered</h4>
    <div id="buffer" class="click-flex"></div>
    <h4>Count only</h4>
    <div id="num" class="click-flex"></div>
    <h4>Double or more only</h4>
    <div id="result" class="click-flex"></div>
  </div>
  <div class="box-action">
    <button id="theButton" class="btn" type="button">Click me!</button><a href="#code1" class="pre-btn btn-text">Code</a>
  </div>
</div>

<pre id="code1" class="hidden">
  <code>var clickStream = Rx.Observable.fromEvent(clickButton, 'click');

// Just 4 lines of code!

var multiClickStream = clickStream
  .buffer(clickStream.throttle(300))
  .filter(function(mouseEvents) { return mouseEvents.length >= 2; })
  .map(function(mouseEvents) { return mouseEvents.length; });
  </code>
</pre>

<script async src="/react/js/clickity.js"></script>
