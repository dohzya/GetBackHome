app.service("Map", ["Places", function (Places) {
  "use strict";

  var Hexjs = window.Hexjs;

  function tileAccessor (place) {
    return place.tile;
  }

  function getPlace(x, y) {
    return Hexjs.find(Places.all(), x, y, tileAccessor);
  }

  function getCenterPlace() {
    return getPlace(7, 4);
  }

  function neighbors(place) {
    return Hexjs.neighbors(Places.all(), place.x(), place.y(), tileAccessor);
  }

  function forEach(func) {
    var i;
    for (i = 0; i < Places.all().length; i++) {
      func(Places.all()[i]);
    }
  }

  function hex_round(pos) {
    var x = Math.ceil(pos[0]);
    var y = Math.ceil(pos[1]);
    return getPlace(x, y);
  }

  function tileEqual(tile1, tile2) {
    return tile1.x == tile2.x && tile1.y == tile2.y;
  }

  function cubeNeighbors(place) {
    return Hexjs.cubeNeighbors(place.x(), place.y(), place.z());
  }

  function inNeighborhood(place, place2) {
    var _neighbors = cubeNeighbors(place), i;
    for (i = 0; i < _neighbors.length; i++) {
      if (tileEqual(_neighbors[i], place2.tile)) {
        return true;
      }
    }
    return false;
  }
  function multPos(place, num) {
    return [place.x() * num, place.y() * num, place.z() * num];
  }

  function addPos(pos1, pos2) {
    return [pos1[0] + pos2[0], pos1[1] + pos2[1], pos1[2] + pos2[2]];
  }

  return {
    getPlace: getPlace,
    getCenterPlace: getCenterPlace,
    forEach: forEach,
    neighbors: neighbors
  };

}]);
