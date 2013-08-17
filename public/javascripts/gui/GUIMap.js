app.factory("GUIMap", ["GBHModels", "GUISprites", "GUIZone", "UTGenerator", function (Models, Sprites, Zone, Generator) {
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
    zones = Generator.generate("001", 0, 80, 0, 80, function (json) {
      var place = Models.createPlace(json);
      return Zone.create(place);
    });
  });

  function tileAccessor (zone) {
    return zone.tile;
  }

  function getZone(x, y) {
    return Hexjs.find(zones, x, y, tileAccessor);
  }

  function interpolateZone(px, py) {
    return Hexjs.interpolate(zones, px, py, tileAccessor);
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

}]);
