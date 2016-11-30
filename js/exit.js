// Delete later
var tog = false;
var preY = 0;
var loader = $('#loader');
var container = $('#exit'); // A tároló div neve a jelenlegi dokumentumban
var url = 'pages/exit.html'; // Az exit dokumentum URL-je

$('body').mousemove(function(e) {
  var curY = e.clientY;
  if (curY < preY && curY < 5 && !tog) {
    tog = true;

    container.hide();
    loader.show();

    // AJAX lekérés
    container.load(url, function(response, status, xhr) {
      // Loader képet
      loader.hide();
      if (status === 'error') { // Hibánál kijelzi a felhasználónak
        var msg = 'Hiba történt: ';
        $('#error').html( msg + xhr.status + ' ' + xhr.statusText);
      } else { // Nincs hiba, dokumentum megjelenítése
        container.slideDown(250);
      }
    });
  }
  preY = curY;
});

// Dinamikus csoport, nem lehet közvetlen rá hivatkozni, ezért olyanra kell ami már létezik (pl.: az eredeti dokumentum)
$(document).on('click', '.close-btn', function(e) {
  container.remove();
});
