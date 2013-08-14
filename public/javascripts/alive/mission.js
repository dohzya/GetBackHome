app.factory("Mission", ["$rootScope", "$log", "Horde", "Env", function ($rootScope, $log, Horde, Env) {
  "use strict";

  var missionId = 0;

  $rootScope.missions = [];


  function Mission(args) {
    this.id = missionId++;
    this.status = "walking";
    this.order = args.order;
    this.group = args.group;
    this.place = args.place;
    this.path = args.path || [];
    this.currentPlace = args.currentPlace;
    this.remainingPath = this.path;
    this.remainingReturnPath = [];
    var i;
    for (i = 0; i < this.path.length; i++) {
      this.remainingReturnPath.unshift(this.path[i]);
    }
    this.elapsedPath = [];
    this.runningTime = this.order.time.rand();
    this.remainingRunningTime = this.runningTime;
    this.time = this.runningTime + this.path.length * 2;
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

  Mission.prototype.turnWalking = function () {
    if (this.remainingPath.length === 0) {
      this.status = "running";
      this.turnRunning();
    } else {
      this.onWalking();
      this.currentPlace.highlighted = false;
      this.elapsedPath.push(this.currentPlace);
      this.currentPlace = this.remainingPath.shift();
      this.currentPlace.highlighted = true;
      console.log("Select ", this.currentPlace);
      this.remainingTime--;
      this.elapsedTime++;
      this.order.onWalk.apply(this);
    }
  };

  Mission.prototype.turnRunning = function () {
    if (this.remainingRunningTime > 0) {
      this.order.onRun.apply(this);
      this.remainingTime--;
      this.remainingRunningTime--;
      this.elapsedTime++;
    } else {
      this.order.run.call(this, this.currentEnv());
      this.status = "returning";
    }
  };

  Mission.prototype.turnReturning = function () {
    if (this.remainingReturnPath.length === 0) {
      this.status = "finished";
      this.currentPlace.highlighted = false;
      this.toRemove = this.order.finish.call(this, this.currentEnv());
      if (this.toRemove) { remove(this); }
      console.log("Mission finished", this);
    } else {
      this.order.onReturn.apply(this);
      this.currentPlace.highlighted = false;
      this.elapsedPath.push(this.currentPlace);
      this.currentPlace = this.remainingReturnPath.shift();
      this.currentPlace.highlighted = true;
      console.log("Select ", this.currentPlace);
      this.remainingTime--;
      this.elapsedTime++;
    }
  };

  Mission.prototype.turn = function () {
    $log.debug("Mission#turn: {0}", this);
    if (this.status == "running") {
      this.turnRunning();
    } else if (this.status == "walking") {
      this.turnWalking();
    } else if (this.status == "returning") {
      this.turnReturning();
    }
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
