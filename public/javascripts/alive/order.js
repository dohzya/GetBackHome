app.factory("Order", ["$rootScope", "Util", "Time", function ($rootScope, Util, Time) {
  "use strict";

  function Order(args) {
    this.id = args.id;
    this.name = args.name;
    this.time = args.time;
    this.onWalk = args.onWalk || Util.noop;
    this.onTurn = args.onTurn || Util.noop;
    this.onRun = args.onRun || Util.noop;
    this.isAvailable = args.isAvailable || function () { return true; };
    this.run = args.run;
  }

  function create(args) {
    return new Order(args);
  }

  function get(id) {
    return $rootScope.orders[id];
  }

  return {
    create: create,
    get: get,
    all: function () { return $rootScope.orders; }
  };

}]);
