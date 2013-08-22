app.factory("Order", ["Util", function (Util) {
  "use strict";

  function Order(args) {
    this.id = args.id;
    this.name = args.name;
    this.icon = args.icon;
    this.description = args.description;
    this.inputs = args.inputs || [];
    this.time = args.time;
    this.onWalk = args.onWalk || Util.noop;
    this.onTurn = args.onTurn || Util.noop;
    this.onRun = args.onRun || Util.noop;
    this.onReturn = args.onReturn || Util.noop;
    this.isAvailableAt = args.isAvailableAt || function () { return true; };
    this.isValid = args.isValid || function () { return true; };
    this.run = args.run;
    this.finish = args.finish;
  }

  function create(args) {
    return new Order(args);
  }

  return {
    create: create
  };

}]);
