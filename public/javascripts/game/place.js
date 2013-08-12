app.factory("Place", ["Map", function (Map) {

  function Place(args) {
    this.fighting = args.fighting;
    this.food = args.food;
    this.height = args.height;
    this.horde = args.horde;
    this.infection = args.infection;
    this.pos = args.pos;
    this.ts = args.ts;
    this.types = args.types;
    this.youth = args.youth;
  }

  Place.prototype.defense = function(value) {
    if (value) { this.fighting.defense = value; }
    return this.fighting.defense;
  };

  Place.prototype.AddDefense = function(value) {
    return this.defense(this.defense() + value);
  };

  Place.prototype.attack = function() {
    return this.fighting.attack;
  };

  Place.prototype.biome = function() {
    return this.types[0];
  };

  Place.prototype.type2 = function() {  // FUUUUUUUUU
    return this.types[1];
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