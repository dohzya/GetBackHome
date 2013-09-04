app.service("Engine", ["$rootScope", "$log", "Util", "Events", "Places", "Orders", "Groups", "Missions", "Env", "Times", "GBHActions", "Map",
  function ($rootScope, $log, Util, Events, Places, Orders, Groups, Missions, Env, Times, Actions, Map) {
  "use strict";

  var self = this;

  // Global
  $rootScope.engine.turnNb = 0;
  $rootScope.engine.mainGroup = Groups.create(10);
  var selectedSurvivors = 0;

  // Main
  var mainEnv;

  // When everything is ready, start the engine!
  function start() {
    $rootScope.engine.mainPlace = $rootScope.selection.base.place;
    mainEnv = Env.create({
      group: $rootScope.engine.mainGroup,
      place: $rootScope.engine.mainPlace
    });
    turnForPlaces();
  }

  start();

  
  // setTimeout(function () {
  //   $rootScope.engine.mainPlace = $rootScope.selection.base.place;
  //   mainEnv = Env.create({
  //     group: $rootScope.engine.mainGroup,
  //     place: $rootScope.engine.mainPlace
  //   });
  //   turnForPlaces();
  // }, 2000);

  function selectedPlace() {
    return $rootScope.gui.selectedZone ? $rootScope.gui.selectedZone.place : $rootScope.engine.mainPlace;
  }
  function selectedEnv() {
    return Env.create({
      group: $rootScope.engine.mainGroup,
      place: selectedPlace()
    });
  }

  function selectSurvivors(s) {
    selectedSurvivors = Math.min(s, $rootScope.engine.mainGroup.length());
    return selectedSurvivors;
  }

  function selectOrder(order) {
    selectedOrder = order;
    return order;
  }

  function sendSelected(nb) {
    var group = splitGroup($rootScope.engine.mainGroup, nb);
    selectedSurvivors = 0;
    return group;
  }

  function splitGroup(group, nb) {
    var removed = [], i;
    for (i = 0; i < nb; i++) {
      removed.push(group.survivors.shift());
    }
    return Groups.create({
      memory: group.memory.clone(),
      survivors: removed
    });
  }

  function pathToSelectedPlace() {
    return Map.findPath($rootScope.engine.mainPlace, selectedPlace());
  }

  function sendOrder(order) {
    var path = pathToSelectedPlace();
    var i;
    for (i = 0; i < path.length; i++) {
      path[i].selected = false;
    }
    var mission = Missions.create({
      order: order,
      group: sendSelected(selectedSurvivors),
      place: selectedPlace(),
      currentPlace: $rootScope.engine.mainPlace,
      path: path
    });
    changed();
  }
  function finishMission(mission) {
    // Si on veut la mettre dans Models, il faut automatiser le concept
    // d'une mission qui arrive ou fini dans un env, et merger avec cet
    // env en question
    var i, survivor;
    for (i in mission.group.survivors) {
      survivor = mission.group.survivors[i];
      $rootScope.engine.mainGroup.survivors.push(survivor);
    }
    var memory, memories, done = false;
    $rootScope.engine.mainGroup.memory.merge(mission.group.memory);
    console.log("main memory: ", $rootScope.engine.mainGroup.memory);
    changed();
  }

  function turn() {
    _.forEach($rootScope.currentPlayer().missions, function (mission) {
      if (mission) {  // TODO fix this creepy line
        mission.turn($rootScope.engine.turnNb);
      }
    });
    $rootScope.engine.turnNb++;
    turnForEnv(mainEnv);
    turnForPlaces();
    changed();
    $rootScope.$broadcast(Events.gui.draw);
  }

  function turnForPlaces() {
    Places.forEach(turnForPlace);
    $rootScope.engine.mainGroup.visitPlace($rootScope.engine.turnNb, $rootScope.engine.mainPlace);
  }

  function turnForPlace(place) {
    place.endTurn($rootScope.engine.turnNb);
  }

  function turnForEnv(env) {
    consumeFood(env);
    addZombies(env);
    addSurvivors(env);
    if (env.horde().length() > 0 && Util.random() > 0.7) { zombieAttack(env); }
  }

  function consumeFood(env) {
    var nb = env.group.length();
    var consumedFood = Util.random(nb * 0.8, nb * 1.2);
    if (consumedFood < env.place.food) {
      env.place.food -= consumedFood;
    } else {
      var diff = consumedFood - env.place.food;
      env.place.food = 0;
    }
  }

  function addZombies(env) {
    var newZombies = Util.random(10, 100);
    env.place.horde.addZombies(newZombies);
  }

  function addSurvivors(env) {
    if (Util.random() > 0.8) {
      var newSurvivors = Math.round(Util.random(1, 6) / 2);
      env.group.addSurvivors += newSurvivors;
    }
  }

  function zombieAttack(env) {
    var ratio = env.ratio();
    var killZombies = 0;
    var killSurvivors = 0;
    var damage = 0;
    killZombies = Util.positiveFloor(env.horde().length() * Util.random(ratio * 50, ratio * 100)/100);
    killSurvivors = Util.positiveFloor(env.group.length()  *  Util.random((1 - ratio) * 50, (1-ratio) * 100)/100);
    damage = Util.positiveFloor(env.place.defense() * 100  *  Util.random((1 - ratio) * 50, (1-ratio) * 100)/100);
    env.horde().removeZombies(killZombies);
    env.group.removeSurvivors(killSurvivors);
    env.place.addDefense(-damage / 100);
    changed();
  }

  function changed() {
    
  }

  function defineOrder(args) {
    //$rootScope.orders[args.id] = Orders.create(args);
  }

  defineOrder({
    id: "purify",
    name: "Purification",
    time: Times.create({
      min: 1,
      standard: 3
    }),
    run: function (env) {
      var ratio = env.ratio();
      var killZombies = 0;
      var killSurvivors = 0;
      killZombies = Util.positiveFloor(env.horde().length() * Util.random(ratio * 50, ratio * 100) / 100);
      killSurvivors = Util.positiveFloor(env.group.length() * Util.random((1 - ratio) * 50, (1 - ratio) * 100) / 100);
      env.horde().killZombies(killZombies);
      env.group.killSurvivors(killSurvivors);
    },
    finish: function () {
      finishMission(this);
      return true;
    }
  });
  Actions.createAction({
    id: "purify",
    name: "Purifier",
    stats: {
      safe: Actions.createStat({
        id: "safe",
        label: "Sécurité",
        value: 100
      }),
      turns: Actions.createStat({
        id: "turns",
        label: "Tours",
        value: 3
      })
    },
    order: "purify"
  });

  defineOrder({
    id: "fortify",
    name: "Fortification",
    time: Times.create({
      min: 1,
      standard: 2
    }),
    run: function (env) {
      var tooling = env.group.tooling() / 10;
      var max = Math.min(tooling, 1 - env.place.defense()) * 100;
      var fortifying = Util.random(max / 2, max) / 100;
      env.place.addDefense(fortifying);
    },
    finish: function () {
      finishMission(this);
      return true;
    }
  });
  Actions.createAction({
    id: "fortify",
    name: "Fortifier",
    stats: {
      build: Actions.createStat({
        id: "build",
        label: "Avancement",
        value: 100,
        update: function (env) {
          console.log("env:", env);
          // var middle = max - max/4;
        }
      }),
      safe: Actions.createStat({
        id: "safe",
        label: "Sécurité",
        value: 100
      }),
      turns: Actions.createStat({
        id: "turns",
        label: "Tours",
        value: 3
      })
    },
    order: "fortify"
  });

  Orders.create({
    id: "scavange",
    name: "Fouille",
    time: Times.create({
      min: 1,
      standard: 2
    }),
    run: function (env) {
      var scavangedFood = Util.random(2, 10);
      env.place.food += scavangedFood;
      finishMission(this);
      return true;
    }
  });
  Actions.createAction({
    id: "scavange",
    name: "Fouiller",
    stats: {
      build: Actions.createStat({
        id: "scavange",
        label: "Récupération",
        value: 6
      }),
      safe: Actions.createStat({
        id: "safe",
        label: "Sécurité",
        value: 100
      }),
      turns: Actions.createStat({
        id: "turns",
        label: "Tours",
        value: 2
      })
    },
    order: "scavange"
  });

  // Export
  $.extend(self, {
    sendOrder: sendOrder,
    turn: turn,
    selectSurvivors: selectSurvivors,
    selectOrder: selectOrder
  });

}]);
