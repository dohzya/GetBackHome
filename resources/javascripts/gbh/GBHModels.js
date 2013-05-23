app.service("GBHModels", ["GBHLogger", function (Logger) {
  "use strict";

  var self = this;

  function random(arg1, arg2) {
    var min, max;
    if (arguments.length > 0) {
      if (arguments.length == 1) {
        min = 0;
        max = arg1;
      }
      else {
        min = arg1;
        max = arg2;
      }
      return Math.floor((Math.random() * (max-min)) + min);
    }
    else return Math.random();
  }

  function minmax(nb) {
    Math.max(0.001, Math.min(nb, 0.99));
  }

  function noop() {}

  // Group:
  // - survivors: num
  function Group(args) {
    this.survivors = args.survivors;
  }
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
  Group.prototype.Length = function() {
    return this.survivors.Length;
  };
  function createGroup(args) {
    if (typeof(args) == "number") {
      return createGroup({
        survivors: createSurvivors(args)
      });
    }
    else {
      return new Group(args);
    }
  }

  // Survivor:
  // - food: num
  // - fighting: num
  function Survivor(args) {
    this.food = args.food;
    this.fighting = args.fighting;
  }
  Survivor.prototype.Defense = function() {
    return this.fighting.defense;
  };
  Survivor.prototype.Attack = function() {
    return this.fighting.attack;
  };
  function createSurvivor(args) {
    return new Survivor(args);
  }
  function createSurvivors(nb) {
    var survivors = [];
    for (var i=0; i<nb; i++) {
      survivors.push(createSurvivors({
        food: 30,
        fighting: createFighting()
      }));
    }
    return survivors;
  }

  // Place:
  // - food: num
  // - fighting: num
  function Place(args) {
    this.food = args.food;
    this.fighting = args.fighting;
  }
  Place.prototype.Defense = function() {
    this.fighting.defense;
  };
  Place.prototype.Attack = function() {
    this.fighting.attack;
  };
  function createPlace(args) {
    return new Place(args);
  }

  // Env:
  // - group: Groupe
  // - place: Place
  // - horde: Horde
  function Env(args) {
    this.group = args.group;
    this.place = args.place;
    this.horde = args.horde;
  }
  Env.prototype.Ratio = function(coef) {
    return minmax(
      ( this.group.Attack() - this.horde.Defence() ) /
      ( this.horde.Attack() - this.group.Defense() )
    );
  };
  function createEnv(args) {
    return new Env(args);
  }

  // Horde:
  // - zombies: [Zombie]
  // - specials: [Special] @oupa
  function Horde(args) {
    this.zombies = args.zombies;
    this.specials = args.specials;
  }
  Group.prototype.Defense = function() {
    var defense = 0;
    for (var i in this.zombies) {
      var zombie = this.zombies[i];
      defense += zombie.Defense();
    }
    return defense;
  };
  Group.prototype.Attack = function() {
    var attack = 0;
    for (var i in this.zombies) {
      var zombie = this.zombies[i];
      attack += zombie.Attack();
    }
    return attack;
  };
  function createHorde(args) {
    if (typeof(args) == "number") {
      createHorde({
        zombies: createZombies(args),
        specials: []
      });
    }
    else {
      return new Horde(args);
    }
  }

  // Zombie:
  // - fighting: num
  // - affut: num
  // - excitation: num
  // - state: num
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
        fighting: createFighting(),
        affut: 0.5,
        excitation: 0.5,
        state: 0.5
      }));
    }
    return zombies;
  }

  // Mission:
  // - order: Order
  // - group: Group
  var missions = [];
  function Mission(args) {
    this.order = args.order;
    this.group = args.group;
  }
  Mission.prototype.turn = function() {
    this.order.turn();
  }
  function createMission(args) {
    var mission = new Mission(args);
    missions.push(mission);
    return mission;
  }
  function eachMission(func) {
    for (var i in missions) {
      func(missions[i]);
    }
  }


  var orders = {};

  // Order:
  // - path: [Place]
  // - time: Time
  function Order(args) {
    this.id = args.id;
    this.name = args.name;
    this.path = args.path || [];
    this.remainingPath = this.path;
    this.elapsedPath = [];
    this.time = args.time;
    this.remainingTime = args.time.rand();
    this.elapsedTime = 0;
    this.onTurn = args.onTurn || noop;
    this.run = args.run;
  }
  Order.prototype.turn = function() {
    if (this.remainingPath.length == 0) {
      console.log("Oui")
      this.run();
    }
    else {
      console.log("NON")
      // TODO
    }
  }
  function createOrder(args) {
    var order = new Order(args);
    orders[order.id] = order;
    return order;
  }

  function order(id) {
    return orders[id];
  }

  // Fighting:
  // - defence: num
  // - power: num
  function Fighting(args) {
    this.defence = args.defence || 0.5;
    this.power = args.power || 0.5;
  }
  function createFighting(args) {
    return new Fighting(args || {});
  }

  // Time:
  // - min: num
  // - standard: num
  function Time(args) {
    this.min = args.min;
    this.standard = args.standard;
  }
  Time.prototype.rand = function() {
    var r = random(0.5, 1.5)
    return random(this.min, this.standard * r);
  }
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
    createOrder: createOrder,
    order: order,
    createTime: createTime
  });

}]);
