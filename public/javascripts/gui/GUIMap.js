app.factory("GUIMap", ["Places", "Sprites", "Zones", "UTGenerator", function (Places, Sprites, Zones, Generator) {
  "use strict";

  var canvas = document.getElementById("map");

  var opts = {
    sprites: {
      src: "/assets/images/sprites.png",
      tiles: {
        cursor: [0, 0, 20, 20],
        cursorSelected: [20, 0, 20, 20],

        city: [52, 0, 52, 52],
        forest: [0, 52, 52, 52],
        field: [104, 0, 52, 52],
        grass: [104, 52, 52, 52],
        water: [104, 104, 52, 52],
        mountains: [52, 104, 52, 52]
      }
    }
  };

  var zones = [];
  Sprites.isLoaded().then(function () {
    zones = Generator.generate("001", 0, 20, 0, 20, function (json) {
      var place = Places.create(json);
      return Zones.create(place);
    });
  });

  function tileAccessor (zone) {
    return zone.place.tile;
  }

  function getZone(x, y) {
    return Hexjs.find(Zones.all(), x, y, tileAccessor);
  }

  function interpolateZone(px, py) {
    return Hexjs.interpolate(Zones.all(), px, py, tileAccessor);
  }

  function isReady() {
    return Q.all([Sprites.isLoaded()]);
  }

  return {
    getZones: function () { return Zones.all(); },
    getCanvas: function () { return canvas; },
    getOpts: function () { return opts; },
    getZone: getZone,
    interpolateZone: interpolateZone,
    isReady: isReady
  };

}]);
