app.service("Orders", ["$log", "Util", "Times", function ($log, Util, Times) {
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

  var inputTypes = {
    home: {
      id: "home",
      "default": true,
      template: '<input type="checkbox" ng-model="value"/>'
    },
    survivors: {
      id: "survivors",
      "default": 1,
      min: 1,
      template: '<input type="number" class="form-control" ng-model="value"/>'
    }
  };

  var rawOrders = [
    {
      id: "move",
      name: "Move to",
      icon: "location-arrow",
      description: "",
      time: Times.create({
        min: 1,
        standard: 2
      }),
      run: function (env) {
        env.addLog("Arrived at destination");
      },
      finish: function () {
        return true;
      }
    },
    {
      id: "purify",
      name: "Purification",
      icon: "fire",
      description: "",
      inputs: [
        {
          type: inputTypes.survivors,
          name: "survivors"
        }
      ],
      time: Times.create({
        min: 1,
        standard: 3
      }),
      run: function (env) {
        var ratio = env.ratio();
        env.addLog(
          "Purification ! (survivors: {0}, zombies: {1}, ratio: {2})",
          env.group.length(),
          env.horde().length(),
          ratio
        );
        var killZombies = 0;
        var killSurvivors = 0;
        killZombies = Math.round(env.horde().length() * Util.random(ratio * 50, ratio * 100) / 100);
        killSurvivors = Math.round(env.group.length() * Util.random((1 - ratio) * 50, (1 - ratio) * 100) / 100);
        env.horde().killZombies(killZombies);
        env.group.killSurvivors(killSurvivors, env);
        env.addLog(
          "Purification done ({0} zombies killed, {1} survivors killed, {2} survivors remaining)",
          killZombies,
          killSurvivors,
          env.group.length()
        );
      },
      finish: function () {
        return true;
      }
    },
    {
      id: "fortify",
      name: "Fortification",
      icon: "building",
      description: "",
      time: Times.create({
        min: 1,
        standard: 2
      }),
      run: function (env) {
        var tooling = env.group.tooling() / 10;
        var max = Math.min(tooling, 1 - env.place.defense()) * 100;
        var fortifying = Util.random(max / 2, max) / 100;
        env.place.addDefense(fortifying);
        env.addLog("Fortication done ({0})", fortifying);
      },
      finish: function () {
        return true;
      }
    }
  ];

  var orders = {};
  _.each(rawOrders, function (order) {
    orders[order.id] = create(order);
  });

  // Export
  return {
    create: create,
    all: function () { return orders; },
    get: function (idOrder) { return orders[idOrder] }
  };

}]);
