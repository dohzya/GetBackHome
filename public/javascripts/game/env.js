window.app.factory("Env", ["Util", function (Util) {
  "use strict";

  function Env(args) {
    this.place = args.place;
    this.group = args.group;
  }

  Env.prototype.horde = function () {
    return this.place.horde;
  };

  Env.prototype.addLog = function () {
    return this.group.addLog.apply(this.group, arguments);
  };

  Env.prototype.ratio = function () {
    var survivors = (this.group.attack() + this.place.attack()) / this.horde().defense();
    var zombies = this.horde().attack() / (this.place.defense() + this.group.defense());
    survivors = Util.minmax(survivors / 3);
    zombies = Util.minmax(zombies / 3);
    return {survivors: survivors, zombies: zombies};
  };

  function create(args) {
    return new Env(args);
  }

  return {
    create: create
  };

}]);
