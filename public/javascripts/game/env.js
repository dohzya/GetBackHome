app.factory("Env", ["Util", function (Util) {

  function Env(args) {
    this.place = args.place;
    this.group = args.group;
  }

  Env.prototype.place = function() {
    return this.place;
  };

  Env.prototype.group = function() {
    return this.group;
  };

  Env.prototype.horde = function() {
    return this.place.horde;
  };

  Env.prototype.ratio = function() {
    return Util.minmax(
      Util.min0( this.group().attack() + this.place().attack() - this.horde().defense() ) /
      Util.min0( this.horde().attack() - this.place().defense() - this.group().defense() )
    );
  };

  function create(args) {
    return new Env(args);
  }

  return {
    create: create
  };

}]);