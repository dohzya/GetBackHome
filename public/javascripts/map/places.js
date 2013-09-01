window.app.factory("Places", ["MemoryItems", "UTGenerator", function (MemoryItems, UTGenerator) {
  "use strict";

  var Hexjs = window.Hexjs;

  var places = UTGenerator.generate("001", 0, 20, 0, 20, function (json) {
    return create(json);
  });

  function tileAccessor (place) {
    return place.tile;
  }

  function Place(args) {
    this.fighting = args.fighting;
    this.food = args.food;
    this.height = args.height;
    this.horde = args.horde;
    this.tile = Hexjs.tile(args.pos[0], args.pos[1]);
    this.types = args.types;
    this.memory = {};
  }

  Place.prototype.memoryItem = function (ts) {
    return this.memory[ts];
  };

  Place.prototype.endTurn = function (ts) {
    // TODO save new memory only if a group saved it
    this.memory[ts] = MemoryItems.create(ts, this);
  };

  Place.prototype.x = function () {
    return this.tile.x;
  };

  Place.prototype.y = function () {
    return this.tile.y;
  };

  Place.prototype.z = function () {
    return this.tile.z;
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

  Place.prototype.distanceTo = function (place) {
    return this.tile.distanceTo(place.tile);
  };

  Place.prototype.costTo = function (place) {
    return 10;
  };

  Place.prototype.neighbors = function () {
    return neighbors(this);
  };

  function create(args) {
    return new Place(args);
  }

  function at(x, y) {
    return Hexjs.find(places, x, y, tileAccessor);
  }

  function getCenterPlace() {
    return at(7, 4);
  }

  function neighbors(place) {
    return Hexjs.neighbors(places, place.x(), place.y(), tileAccessor);
  }

  function forEach(func) {
    _.forEach(places, func);
  }

  function hex_round(pos) {
    var x = Math.ceil(pos[0]);
    var y = Math.ceil(pos[1]);
    return at(x, y);
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
    create: create,
    all: function () { return places; },
    at: at,
    getCenterPlace: getCenterPlace
  };

}]);
