<form id="chat-name-chooser" class="modal" method="post">
  <span class="modal-title">How should we call you?</span>
  <div class="modal-content">
    <div class="input-field dark">
      <input type="text" id="username" name="username" placeholder="Username" data-max-characters="50" autocomplete="off">
      <span class="input-field-icon">
        <i class="fa fa-user" aria-hidden="true"></i>
      </span>
    </div>
  </div>
  <div class="modal-action">
    <button type="submit" id="confirm-btn" class="btn full">Choose</button>
  </div>
</form>

<div class="chat-window box inactive">
  <div class="box-content">
    <span class="box-title pull-right">Users</span>
    <span class="box-title">Chat window</span>
    <div class="chat-container">
      <ul class="chat-list"></ul><ul class="chat-users"></ul>
      <button type="button" class="more-messages">More messages below.</button>
    </div>
    <form class="chat-sender">
      <div class="input-field dark">
        <input type="text" id="message" name="message" placeholder="Type your message here!" autocomplete="off" data-max-characters="255"/>
        <span class="input-field-icon">
          <i class="fa fa-comment" aria-hidden="true"></i>
        </span>
        <button class="color-btn" type="button">
          <i class="fa fa-cog" aria-hidden="true"></i>
        </button>
      </div>
    </form>
    <div class="chat-colorchooser">
      <span id="chat-yourname" class="chat-username"></span>
      <div class="chat-colors">
        <span class="chat-colorsquare red">Red</span>
        <span class="chat-colorsquare yellow">Yellow</span>
        <span class="chat-colorsquare green">Green</span>
        <span class="chat-colorsquare blue">Blue</span>
        <span class="chat-colorsquare white">White</span>
      </div>
    </div>
  </div>
</div>

<script async src='/react/js/chat.js'></script>
