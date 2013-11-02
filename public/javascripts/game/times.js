app.factory("Times", ["Util", function (Util) {
  "use strict";

  function Time(args) {
    this.min = args.min;
    this.standard = args.standard;
  }

  Time.prototype.rand = function () {
    var r = Util.random(50, 150);
    return Math.round(Util.random(this.min, this.standard * r) / 100);
  };

  Time.create = function (args) {
    return new Time(args);
  };

  return {
    create: Time.create
  };

}]);
