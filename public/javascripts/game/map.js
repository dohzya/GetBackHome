app.service("Map", [function () {
  "use strict";

  var map = {
    places: []
  };

  function addPlace(place) {
    map.places.push(place);
  }

  function getPlace(x, y) {
    return _.find(map.places, function (place) {
      return place.pos && (place.x() === x && place.y() === y);
    });
  }

  function forEachPlacesAround(place, func) {
    var neighbors = neighborhood(place);
    var i, pos;
    func(place);
    for (i = 0; i < neighbors.length; i++) {
      pos = neighbors[i];
      func(getPlace(pos[0], pos[1]));
    }
  }


  function forEach(func) {
    var i;
    for (i = 0; i < map.places.length; i++) {
      func(map.places[i]);
    }
  }

  function hex_round(pos) {
    var x = Math.ceil(pos[0]);
    var y = Math.ceil(pos[1]);
    return getPlace(x, y);
  }

  function neighborhood(place) {
    var pos = place.pos;
    return [
      [pos[0] - 1, pos[1] - 1],
      [pos[0],     pos[1] - 1],
      [pos[0] + 1, pos[1]],
      [pos[0] + 1, pos[1] + 1],
      [pos[0],     pos[1] + 1],
      [pos[0] - 1, pos[1]]
    ];
  }

  function posEqual(pos1, pos2) {
    return pos1[0] == pos2[0] && pos1[1] == pos2[1];
  }

  function inNeighborhood(place, place2) {
    var neighbors = neighborhood(place), i;
    for (i = 0; i < neighbors.length; i++) {
      if (posEqual(neighbors[i], place2.pos)) {
        return true;
      }
    }
    return false;
  }

  // Remove useless places in path
  function cleanPath(path) {
    var cleaned = [];
    var i, n2, n1, n0;
    for (i = 0; i < path.length; i++) {
      n2 = n1;
      n1 = n0;
      n0 = path[i];
      if (n2) {
        cleaned.push(n2);
        if (inNeighborhood(n0, n2)) {
          n1 = null;
        }
      }
    }
    if (n1) { cleaned.push(n1); }
    if (n0) { cleaned.push(n0); }
    return cleaned;
  }

  function multPos(place, num) {
    return [place.x() * num, place.y() * num, place.z() * num];
  }

  function addPos(pos1, pos2) {
    return [pos1[0] + pos2[0], pos1[1] + pos2[1], pos1[2] + pos2[2]];
  }

  function findPath(from, to) {
    // http://www.redblobgames.com/grids/hexagons/#line-drawing

    // Adjust one endpoint to break ties, make lines look better
    var epsilon = 1e-6;
    var fromX = from.x() + epsilon;
    var fromY = from.y() + epsilon;
    var fromZ = from.z() - 2 * epsilon;

    var deltaX = fromX - to.x();
    var deltaY = fromY - to.y();
    var deltaZ = fromZ - to.z();
    var N = Math.max(Math.abs(deltaX - deltaY), Math.abs(deltaY - deltaZ), Math.abs(deltaZ - deltaX));

    var prev = null, i, p;
    var selection = [];
    for (i = 0; i < N; i++) {
      p = hex_round(addPos(multPos(from, (i / N)), multPos(to, (1 - i / N))));
      if (p != from && p != prev) {
        selection.unshift(p);
        prev = p;
      }
    }

    return cleanPath(selection);
  }

  return {
    addPlace: addPlace,
    getPlace: getPlace,
    forEach: forEach,
    forEachPlacesAround: forEachPlacesAround,
    findPath: findPath
  };

}]);