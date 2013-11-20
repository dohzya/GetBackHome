app.factory("Missions", ["$rootScope", "$log", "Env", "Orders", function ($rootScope, $log, Env, Orders) {
  "use strict";

  var missionId = 0;

  function Action(args) {
    this.order = args.order;
    this.place = args.place;
    this.data = {};
    this.next = null;
  }
  Action.prototype.setNext = function (next) {
    this.next = next;
  };
  Action.prototype.targetPlace = function () {
    return this.place;
  };
  Action.create = function (args) {
    return new Action(args);
  };

  function Mission(args) {
    this.id = missionId++;
    this.status = "walking";
    this.action = null;
    this.group = args.group;
    this.fromBase = args.fromBase;
    this.toBase = args.toBase;
    this.place = this.fromBase.place;
    this.consumedForAction = 0;
    this.consumedForTurn = 0;
  }

  Mission.prototype.addAction = function (action) {
    var last;
    if (last) {
      last = this.action;
      while (last.next) {
        last = last.next;
      }
    } else {
      this.action = action;
    }
  };

  Mission.prototype.getAllOrders = function () {
    var actions = [];
    this.forEachOrders(function (action) {
      actions.push(action);
    });
    return actions;
  };

  Mission.prototype.hasOrders = function () {
    return !!this.action;
  };

  Mission.prototype.forEachOrders = function (predicate, context) {
    var action = this.action, res = null;
    while (action) {
      res = predicate.call(context, action);
      if (res === false) break;
      action = action.next;
    }
  };

  Mission.prototype.allOrders = function (predicate, context) {
    var res = true;
    this.forEachOrders(function (action) {
      res = res && predicate.call(context, action);
      return res;
    });
    return res;
  };

  Mission.prototype.anyOrders = function (predicate, context) {
    var res = false;
    this.forEachOrders(function (action) {
      res = res || predicate.call(context, action);
      return !res;
    });
    return res;
  };

  Mission.prototype.isCancelable = function () {
    return this.place === this.toBase.place;
  };

  Mission.prototype.currentPlace = function () {
    return this.place;
  };

  Mission.prototype.estimatedTime = function () {
    return 1;
  };

  Mission.prototype.currentEnv = function (place) {
    if (place && place != this.place) {
    }
    return Env.create({
      group: this.group,
      place: this.place
    });
  };

  Mission.prototype.estimatedTimeToComplete = function () {
    return 2;
  };

  Mission.prototype.endTurn = function (ts) {
    this.consumedForTurn = 0;
  };
  Mission.prototype.canAct = function () {
    return this.consumedForTurn < this.group.endurance();
  }
  Mission.prototype.orderCost = function () {
    return 1;
  };
  Mission.prototype.moveCost = function (place1, place2) {
    return 1;
  };
  Mission.prototype.nextPlace = function (place1, place2) {
    return _.first(place1.pathTo(place2));
  };
  Mission.prototype.turn = function (ts) {
    var
      result = {},
      nextPlace,
      cost;
    this.consumedForTurn++;
    this.consumedForAction++;
    if (!this.action) {
      if (this.place === this.toBase.place) {
        // And we are done here
        this.place.removeMission(this);
        this.status = "finished";
        Mission.finish(this);
        return false;
      }
      this.action = Action.create({
        order: Orders.get("move"),
        place: this.toBase.place
      });
    }
    if (this.place == this.action.place) {
      // We are in position, let's rock
      this.status = "acting";
      this.action.order.run(this.currentEnv());
      // Have we finished?
      cost = this.orderCost();
      if (this.consumedForAction >= cost) {
        this.action = this.action.next;
        this.consumedForAction = 0;
      }
    } else {
      // Moving to the target place
      this.status = "walking";
      // Have we finished?
      nextPlace = this.nextPlace(this.place, this.action.place);
      cost = this.moveCost(this.place, this.action.place);
      if (this.consumedForAction >= cost) {
        this.place.removeMission(this);
        this.place = nextPlace;
        this.place.addMission(this);
        this.action.consumedForAction = 0;
      } else {
      }
    }
    if (_.isEmpty(this.group)) {
      // everybody's dead
      this.place.removeMission(this);
      Mission.fail(this);
      return false;
    }
    this.group.visitPlace(ts, this.place);
    return true;
  };

  Mission.each = function (func) {
    _.forEach($rootScope.currentPlayer().missions, func);
  };

  Mission.remove = function (missionToRemove) {
    $rootScope.currentPlayer().missions = _.filter($rootScope.currentPlayer().missions, function (mission) {
      return mission.id !== missionToRemove.id;
    });
  };

  Mission.finish = function (mission) {
    mission.currentEnv().addLog(
      "Mission finished ({0} survivors returned)",
      mission.group.length()
    );
    $rootScope.engine.mainGroup.merge(mission.group);
    Mission.remove(mission);
  };

  Mission.fail = function (mission) {
    mission.currentEnv().addLog("Mission failed (no more survivors)");
    Mission.remove(mission);
  };

  Mission.create = function (args) {
    return new Mission(args);
  };

  return {
    create: Mission.create,
    createAction: Action.create,
    each: Mission.each,
    finish: Mission.finish,
    remove: Mission.remove
  };

}]);
