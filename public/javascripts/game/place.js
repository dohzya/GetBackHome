window.app.factory("Place", ["Map", "MemoryItem", function (Map, MemoryItem) {
  "use strict";

  function Place(args) {
    this.fighting = args.fighting;
    this.food = args.food;
    this.height = args.height;
    this.horde = args.horde;
    this.pos = args.pos;
    this.types = args.types;
    this.memory = {};
  }

  Place.prototype.memoryItem = function (ts) {
    return this.memory[ts];
  };

  Place.prototype.endTurn = function (ts) {
    // TODO save new memory only if a group saved it
    this.memory[ts] = MemoryItem.create(ts, this);
  };

  Place.prototype.x = function () {
    return this.pos[0];
  };

  Place.prototype.y = function () {
    return this.pos[1];
  };

  Place.prototype.z = function () {
    return -(this.x() + this.y());
  };

  Place.prototype.defense = function (value) {
    if (value) { this.fighting.defense = value; }
    return this.fighting.defense;
  };

  Place.prototype.addDefense = function (value) {
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
