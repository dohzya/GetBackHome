app.factory("Map", [function () {
  "use strict";

  var map = {
    places: []
  };

  function addPlace(place) {
    map.places.push(place);
  }

  function getPlace(x, y) {
    return _.find(map.places, function (place) {
      return (place.pos[x] === x && place.pos[y] === y);
    });
  }

  return {
    addPlace: addPlace,
    getPlace: getPlace
  };

}]);
