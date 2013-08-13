window.app.factory("Place", ["Map", function (Map) {
  "use strict";

  function Place(args) {
    this.fighting = args.fighting;
    this.food = args.food;
    this.height = args.height;
    this.horde = args.horde;
    this.pos = args.pos;
    this.ts = args.ts;
    this.types = args.types;
    this.youth = args.youth;
  }

  Place.prototype.defense = function (value) {
    if (value) { this.fighting.defense = value; }
    return this.fighting.defense;
  };

  Place.prototype.AddDefense = function (value) {
    return this.defense(this.defense() + value);
  };

  Place.prototype.attack = function () {
    return this.fighting.attack;
  };

  Place.prototype.biome = function () {
    return this.types[0];
  };

  Place.prototype.type2 = function () {  // FUUUUUUUUU
    return this.types[1];
  };

  Place.prototype.infection = function () {
    var l = this.horde.length();
    return parseInt(Math.min(999.99, l) / 10, 10);
  };

  function create(args) {
    var place = new Place(args);
    Map.addPlace(place);
    return place;
  }

  return {
    create: create
  };

}]);
