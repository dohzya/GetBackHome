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
        getInfosForZombie(zombie);
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
    this.place = place;
    this.infos = getInfosForPlace(place);
  }

  MemoryItem.prototype.infection = function () {
    var l = this.infos.horde.zombies.length;
    return parseInt(Math.min(999.99, l) / 10, 10);
  };

  function create(ts, place) {
    return new MemoryItem(ts, place);
  }

  return {
    create: create
  };

}]);
