window.app.factory("Env", ["Util", function (Util) {
  "use strict";

  function Env(args) {
    this.place = args.place;
    this.group = args.group;
  }

  Env.prototype.horde = function () {
    return this.place.horde;
  };

  Env.prototype.addLog = function (msg) {
    console.log("Env#addLog(", msg, ", *", arguments, ")");
    return this.group.addLog.apply(this.group, msg, arguments);
  };

  Env.prototype.ratio = function () {
    var r1 = Util.min0(this.group.attack() + this.place.attack() - this.horde().defense());
    var r2 = Util.min0(this.horde().attack() - this.place.defense() - this.group.defense());
    return Util.minmax(r1 / r2);
  };

  function create(args) {
    return new Env(args);
  }

  return {
    create: create
  };

}]);
