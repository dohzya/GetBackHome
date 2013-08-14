app.factory("Mission", ["$rootScope", "$log", "Horde", "Env", function ($rootScope, $log, Horde, Env) {
  "use strict";

  var missionId = 0;

  function Mission(args) {
    this.id = missionId++;
    this.status = "walking";
    this.order = args.order;
    this.group = args.group;
    this.place = args.place;
    this.path = args.path || [];
    this.remainingPath = this.path;
    this.elapsedPath = [];
    this.time = this.order.time.rand();
    this.remainingTime = this.time;
    this.elapsedTime = 0;
  }

  Mission.prototype.estimatedTime = function () {
    return this.order.time.standard + this.path.length;
  };

  Mission.prototype.currentEnv = function () {
    return Env.create({
      group: this.group,
      place: this.currentPlace,
      horde: Horde.create(10)  // CHANGEME
    });
  };

  Mission.prototype.estimatedTimeToComplete = function () {
    return this.estimatedTime() - this.elapsedTime;
  };

  Mission.prototype.turn = function () {
    if (this.remainingPath.length === 0) {
      this.status = "running";
      if (this.remainingTime === 0) {
        this.status = "finished";
        var remove = this.order.run.call(this, this.CurrentEnv());
        if (remove) { removeMission(this); }
      }
      else {
        this.remainingTime--;
        this.elapsedTime++;
        this.order.onRun.apply(this);
      }
    }
    else {
      Logger.warn("Mission is walking but this is not implemented ({0})", this);
      this.order.onWalk.apply(this);
    }
    Logger.trace("Mission#turn: {0}", this);
  };

  function create(args) {
    var mission = new Mission(args);
    $rootScope.missions.push(mission);
    return mission;
  }

  function each(func) {
    var i;
    for (i in $rootScope.missions) {
      func($rootScope.missions[i]);
    }
  }

  function remove(missionToRemove) {
    var newMissions = [], i, mission;
    for (i in $rootScope.missions) {
      mission = $rootScope.missions[i];
      if (mission.id !== missionToRemove.id) {
        newMissions.push(mission);
      }
    }
    $rootScope.missions = newMissions;
  }

  return {
    create: create,
    each: each,
    remove: remove
  };

}]);
