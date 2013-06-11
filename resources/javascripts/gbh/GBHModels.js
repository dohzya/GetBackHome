app.service("GBHModels", ["$rootScope", "GBHLogger", function ($rootScope, Logger) {
  "use strict";

  var self = this;

  function random(arg1, arg2) {
    var min, max;
    if (arguments.length > 0) {
      if (arguments.length === 1) {
        min = 0;
        max = arg1;
      }
      else {
        min = arg1;
        max = arg2;
      }
      return Math.floor((Math.random() * (max-min)) + min);
    }
    else { return Math.random(); }
  }

  function minmax(nb) {
    return min0(max100(nb));
  }
  function min0(nb) {
    return Math.max(0.00001, nb);
  }
  function max100(nb) {
    return Math.min(nb, 0.99999);
  }

  function noop() {}

  /*
   * Group
   */
  function Group(args) {
    this.survivors = args.survivors;
  }
  Group.prototype.KillSurvivors = function(nb) {
    var survivors = [];
    for (var i=0; i<this.survivors.length-nb; i++) {
      survivors.push(this.survivors[i]);
    }
    this.survivors = survivors;
  };
  Group.prototype.Defense = function() {
    var defense = 0;
    for (var i in this.survivors) {
      var survivor = this.survivors[i];
      defense += survivor.Defense();
    }
    return defense;
  };
  Group.prototype.Attack = function() {
    var attack = 0;
    for (var i in this.survivors) {
      var survivor = this.survivors[i];
      attack += survivor.Attack();
    }
    return attack;
  };
  Group.prototype.Tooling = function() {
    var attack = 0;
    for (var i in this.survivors) {
      var survivor = this.survivors[i];
      attack += survivor.tooling;
    }
    return attack;
  };
  Group.prototype.Length = function() {
    return this.survivors.length;
  };
  function createGroup(args) {
    if (typeof(args) === "number") {
      return createGroup({
        survivors: createSurvivors(args)
      });
    }
    else {
      return new Group(args);
    }
  }

  /*
   * Survivor
   */
  function Survivor(args) {
    this.food = args.food;
    this.fighting = args.fighting;
    this.tooling = args.tooling;
    this.level = args.level;
    this.xp = args.xp;
    this.health = args.health;
    this.currentHealth = args.currentHealth;
    this.mental = args.mental;
    this.currentMental = args.currentMental;
  }
  Survivor.prototype.Defense = function() {
    return this.fighting.defense;
  };
  Survivor.prototype.Attack = function() {
    return this.fighting.attack;
  };
  Survivor.prototype.AddXp = function(xp) {
    this.xp += xp;
    if (this.xp > Math.pow(2, this.level)) {
      this.level++;
      this.health += 0.2;
      this.mental += 0.2;
    }
  };
  function createSurvivor(args) {
    return new Survivor(args);
  }
  function createSurvivors(nb) {
    var survivors = [];
    for (var i=0; i<nb; i++) {
      survivors.push(createSurvivor({
        food: 30,
        fighting: createFighting("survivor"),
        tooling: 0.5,
        level: 1,
        xp: 0,
        health: 1,
        currentHealth: 0.5,
        mental: 1,
        currentMental: 0.5
      }));
    }
    return survivors;
  }

  /*
   * Place
   */
  function Place(args) {
    this.food = args.food;
    this.horde = args.horde;
    this.fighting = args.fighting;
  }
  Place.prototype.Defense = function(value) {
    if (value) { this.fighting.defense = value; }
    return this.fighting.defense;
  };
  Place.prototype.AddDefense = function(value) {
    return this.Defense(this.Defense() + value);
  };
  Place.prototype.Attack = function() {
    return this.fighting.attack;
  };
  function createPlace(args) {
    return new Place(args);
  }

  /*
   * Env
   */
  function Env(args) {
    this.place = args.place;
    this.group = args.group;
  }
  Env.prototype.Place = function() {
    return this.place;
  };
  Env.prototype.Group = function() {
    return this.group;
  };
  Env.prototype.Horde = function() {
    return this.place.horde;
  };
  Env.prototype.Ratio = function() {
    return minmax(
      min0( this.Group().Attack() + this.Place().Attack() - this.Horde().Defense() ) /
      min0( this.Horde().Attack() - this.Place().Defense() - this.Group().Defense() )
    );
  };
  function createEnv(args) {
    return new Env(args);
  }

  /*
   * Horde
   */
  function Horde(args) {
    this.zombies = args.zombies;
  }
  Horde.prototype.KillZombies = function(nb) {
    var zombies = [];
    for (var i=0; i<this.zombies.length-nb; i++) {
      zombies.push(this.zombies[i]);
    }
    this.zombies = zombies;
  };
  Horde.prototype.Defense = function() {
    var defense = 0;
    for (var i in this.zombies) {
      var zombie = this.zombies[i];
      defense += zombie.Defense();
    }
    return defense;
  };
  Horde.prototype.Attack = function() {
    var attack = 0;
    for (var i in this.zombies) {
      var zombie = this.zombies[i];
      attack += zombie.Attack();
    }
    return attack;
  };
  Horde.prototype.Length = function() {
    return this.zombies.length;
  };
  Horde.prototype.AddZombies = function(nb) {
    var newZombies = createZombies(nb);
    for (var i in newZombies) {
      this.zombies.push(newZombies[i]);
    }
  };
  function createHorde(args) {
    if (typeof(args) === "number") {
      return createHorde({
        zombies: createZombies(args)
      });
    }
    else {
      return new Horde(args);
    }
  }

  /*
   * Zombie
   */
  function Zombie(args) {
    this.fighting = args.fighting;
    this.affut = args.affut;
    this.excitation = args.excitation;
    this.state = args.state;
  }
  Zombie.prototype.Defense = function() {
    return this.fighting.defense;
  };
  Zombie.prototype.Attack = function() {
    return this.fighting.attack;
  };
  function createZombie(args) {
    return new Zombie(args);
  }
  function createZombies(nb) {
    var zombies = [];
    for (var i=0; i<nb; i++) {
      zombies.push(createZombie({
        fighting: createFighting("zombie"),
        affut: 0.5,
        excitation: 0.5,
        state: 0.5
      }));
    }
    return zombies;
  }

  /*
   * Mission
   */
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
  Mission.prototype.estimatedTime = function() {
    return this.order.time.standard + this.path.length;
  };
  Mission.prototype.CurrentEnv = function() {
    return createEnv({
      group: this.group,
      place: this.place,
      horde: createHorde(10)  // CHANGEME
    });
  };
  Mission.prototype.EstimatedTimeToComplete = function() {
    return this.estimatedTime() - this.elapsedTime;
  };
  Mission.prototype.turn = function() {
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
  function createMission(args) {
    var mission = new Mission(args);
    $rootScope.missions.push(mission);
    return mission;
  }
  function eachMission(func) {
    for (var i in $rootScope.missions) {
      func($rootScope.missions[i]);
    }
  }
  function removeMission(missionToRemove) {
    var newMissions = [];
    for (var i in $rootScope.missions) {
      var mission = $rootScope.missions[i];
      if (mission.id !== missionToRemove.id) {
        newMissions.push(mission);
      }
    }
    $rootScope.missions = newMissions;
  }

  /*
   * Order
   */
  var orders = {};
  function Order(args) {
    this.id = args.id;
    this.name = args.name;
    this.time = args.time;
    this.onWalk = args.onWalk || noop;
    this.onTurn = args.onTurn || noop;
    this.onRun = args.onRun || noop;
    this.run = args.run;
  }
  function createOrder(args) {
    var order = new Order(args);
    orders[order.id] = order;
    return order;
  }
  function order(id) {
    return orders[id];
  }

  /*
   * Fighting
   */
  function Fighting(args) {
    this.attack = args.attack;
    this.defense = args.defense;
  }
  function createFighting(args) {
    if (args === "survivor") {
      args = {
        attack: 10,
        defense: 10
      };
    }
    else if (args === "zombie") {
      args = {
        attack: 0.1,
        defense: 0.1
      };
    }
    return new Fighting(args);
  }

  /*
   * Time
   */
  function Time(args) {
    this.min = args.min;
    this.standard = args.standard;
  }
  Time.prototype.rand = function() {
    var r = random(50, 150);
    return Math.round(random(this.min, this.standard * r) / 100);
  };
  function createTime(args) {
    return new Time(args);
  }

  // Export
  $.extend(self, {
    createGroup: createGroup,
    createSurvivors: createSurvivors,
    createPlace: createPlace,
    createEnv: createEnv,
    createHorde: createHorde,
    createZombie: createZombie,
    createZombies: createZombies,
    createMission: createMission,
    eachMission: eachMission,
    removeMission: removeMission,
    createOrder: createOrder,
    order: order,
    createTime: createTime,
    createFighting: createFighting
  });

}]);
