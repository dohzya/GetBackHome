window.app.factory("MemoryItem", [function () {
  "use strict";

  function getInfosForFighting(fighting) {
    return {
      attack: fighting.attack,
      defense: fighting.defense
    };
  }

  function getInfosForZombie(zombie) {
    return {
      fighting: getInfosForFighting(zombie.fighting),
      affut: zombie.affut,
      excitation: zombie.excitation,
      state: zombie.state
    };
  }

  function getInfosForHorde(horde) {
    return {
      zombies: _.map(horde.zombies, function (zombie) {
        getInfosForZombie();
      })
    };
  }

  function getInfosForPlace(place) {
    return {
      fighting: getInfosForFighting(place.fighting),
      food: place.food,
      // TODO saveInfosForGroup
      horde: getInfosForHorde(place.horde)
    };
  }

  function MemoryItem(ts, place) {
    this.ts = ts;
    this.place = getInfosForPlace(place);
  }

  function create(ts, place) {
    return new MemoryItem(ts, place);
  }

  return {
    create: create
  };

}]);
