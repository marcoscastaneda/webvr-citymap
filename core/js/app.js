var vrModule = (function() {

  // Placeholders/global vars
  var LOCATION;
  var HEIGHT = 1;
  var RADIUS = 15;

  // Init by finding location
  function init()
  {

    if ("geolocation" in navigator) {

      navigator.geolocation.getCurrentPosition(function(position) {
        LOCATION = new LatLon(position.coords.latitude, position.coords.longitude);
        _render();
        
      });

    } else {
      LOCATION = new LatLon(30.453549, -84.314479);
      _render();
    }

  }

  function _render()
  {
    // Grab and compile the template.
    var scene = document.querySelector('a-scene');
    var str = document.querySelector('#locations-template').innerHTML;
    var template = Handlebars.compile(str);

    // Turn locations into a geopoint and find bearing
    Handlebars.registerHelper('getPosition', function(obj) {
      var geo_obj = new LatLon(obj.geopoint[0], obj.geopoint[1]);
      var bearing = LOCATION.bearingToXY(geo_obj);
      return (bearing[0] * RADIUS) + ' ' + HEIGHT + ' ' + (bearing[1] * RADIUS);
    });

    // Fetch JSON data for locations
    $.getJSON('core/data/locations.json', function(data) {

      for (var i = 0; i < data.length; i++)
      {
        var elem = template({
          image: data[i].image,
          geopoint: data[i].geopoint
        });

        scene.insertAdjacentHTML('beforeend', elem);
      }

    });
  }

  // Expose API
  return {
    init: init
  };

})();


// Document load
$().ready(function() {
  vrModule.init();
});
