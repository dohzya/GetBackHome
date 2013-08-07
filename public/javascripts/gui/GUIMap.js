app.factory("GUIMap", ["GUISprites", "GUIZone", "UTGenerator", function (Sprites, Zone, Generator) {
  "use strict";

  var canvas = document.getElementById("mainDrawer");

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
  Sprites.isLoaded().then( function() {
    zones = Generator.generate("001", 0, 80, 0, 80, function(zone){
      return Zone.create(zone, opts);
    });
  });

  function getZone(x, y) {
    return _.find(zones, function (zone) {
      return zone.x == x && zone.y == y;
    });
  }

  function interpolateZone(x, y) {
    return _.find(zones, function (zone) {
      return zone.contains(x, y);
    });
  }

  function isReady() {
    return Q.all([Sprites.isLoaded()]);
  }

  return {
    getZones: function () { return zones; },
    getCanvas: function () { return canvas; },
    getOpts: function () { return opts; },
    getZone: getZone,
    interpolateZone: interpolateZone,
    isReady: isReady
  };

}])