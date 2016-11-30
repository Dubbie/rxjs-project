var colorPicker = $('input[type="color"]');
var colorButton = $('.color-chooser');
var input = $('.input-field input');
var ajaxButton = $('.ajaxer');
var page = window.location.search.match(/\?page=(\w*)/) ? window.location.search.match(/\?page=(\w*)/)[1] : 'index';
var mobileBtn = $('#mobile-btn');
var navBtn = $('.ajaxer');

// Functions -------------------------------------------------------------

function toggleSidebar() {
  var navBar = $('nav'),
      container = $('.container-wrap');
      mobile = $('.c-hamburger').css('display') === 'block';

  if (mobile) {
    mobileBtn.toggleClass('is-active');
    navBar.toggleClass('is-active');
    container.toggleClass('is-active');
  }
}

function loadStyleSheet(src) {
  if (document.createStyleSheet) {
    document.createStyleSheet(src);
  } else {
    var stylesheet = document.createElement('link');
    stylesheet.href = src;
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(stylesheet);
  }
}

// Observables -----------------------------------------------------------

var colorClickStream = Rx.Observable.fromEvent(colorPicker, 'change')
  .map(function(e){
    return e.currentTarget.value;
  });
var inputStream = Rx.Observable.merge(
  Rx.Observable.fromEvent(input, 'blur'),
  Rx.Observable.fromEvent(input, 'focus'))
  .map(function(e) {
    return e.target;
  });
var ajaxerStream = Rx.Observable.fromEvent(ajaxButton, 'click').map(function(e) {
  toggleSidebar();
  e.originalEvent.preventDefault();
  return $(e.target).attr('href') !== page ? $(e.target).attr('href').replace('.php', '') : null;
});
var loadStream = Rx.Observable.fromEvent(window, 'load').map(function() {
  return page;
});
var pageStream = Rx.Observable.merge(loadStream, ajaxerStream);
var mobileClickStream = Rx.Observable.fromEvent(mobileBtn, 'click');

// Subscriptions --------------------------------------------------------------------------

colorClickStream.subscribe(function(value) {
  colorButton[0].style.background = value;
});
pageStream.subscribe(function(href) {
  if (href !== null) {
    var url = href + '.php';
    var pageContainer = $('#page');
    var loader = $('.loader');

    pageContainer.hide();
    loader.show();

    pageContainer.load('pages/' + url, function(response, status, xhr) {
      if (status == 'error') {
        var msg = 'Sorry but there was an error!';

        loader.hide();
        console.log(status);
        $('#error').html(msg + response);
      } else {
        // Navbar updating
        var navBar = $('nav');
        navBar.find('a.active').removeClass('active');
        navBar.find('a[href="' + url + '"]').addClass('active');

        // Querystring updating
        window.history.pushState(null,null, '?page=' + href);
        page = href;

        // Rendering
        loader.hide();
        $(document).ready(function() {
          $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
          });
        });
        pageContainer.slideDown();
      }
    });
  }
});
mobileClickStream.subscribe(function(e) {
  toggleSidebar();
});

// Other stuff -------------------------
$(document).ready(function() {
  loadStyleSheet('http://subi.ddns.net/react/css/master.css');
});
