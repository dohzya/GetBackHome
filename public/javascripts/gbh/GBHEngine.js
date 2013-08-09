app.service("GBHEngine", ["$rootScope", "GBHDisplay", "GBHLogger", "GBHOrders", "GBHModels", "GBHActions", "GBHStats", function ($rootScope, Display, Logger, Orders, Models, Actions, Stats) {
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
    else { return Math.random(); }
  }

  function positive(nb) {
    return Math.max(nb, 0);
  }
  function positiveFloor(nb) {
    return Math.floor(positive(nb));
  }

  function to2digits(nb) {
    return Math.round(nb * 100) / 100;
  }

  // Global
  var turnNb = 0;
  var selectedSurvivors = 0;
  var selectedOrder = null;

  // Main
  var mainGroup = Models.createGroup(10);
  var mainPlace = Models.createPlace({
    food: 100,
    horde: Models.createHorde(100),
    fighting: Models.createFighting({
      attack: 0,
      defense: 0.7
    })
  });
  var mainEnv = Models.createEnv({
    group: mainGroup,
    place: mainPlace,
  });

  function selectedPlace() {
    return $rootScope.gui.selectedZone ? $rootScope.gui.selectedZone.place : mainPlace;
  }
  function selectedEnv() {
    return Models.createEnv({
      group: mainGroup,
      place: selectedPlace(),
    });
  }

  function selectSurvivors(s) {
    selectedSurvivors = Math.min(s, mainGroup.Length());
    return selectedSurvivors;
  }

  function selectOrder(id) {
    var action = Actions.action(id);
    selectedOrder = action.order;
    return action;
  }

  function sendSelected(nb) {
    var group = splitGroup(mainGroup, nb);
    selectedSurvivors = 0;
    return group;
  }

  function splitGroup(group, nb) {
    var removed = [];
    for (var i=0; i<nb; i++) {
      removed.push(group.survivors.shift());
    }
    return Models.createGroup({
      survivors: removed
    });
  }

  function sendOrder() {
    Models.createMission({
      order: selectedOrder,
      group: sendSelected(selectedSurvivors),
      place: selectedPlace()
    });
    changed();
  }
  function finishMission(mission) {
    // Si on veut la mettre dans Models, il faut automatiser le concept
    // d'une mission qui arrive ou fini dans un env, et merger avec cet
    // env en question
    for (var i in mission.group.survivors) {
      var survivor = mission.group.survivors[i];
      mainGroup.survivors.push(survivor);
    }
    changed();
  }

  function turn() {
    Models.eachMission(function(mission){
      mission.turn();
    });
    turnNb++;
    turnForEnv(mainEnv);
    changed();
  }

  function turnForEnv(env) {
    consumeFood(env);
    addZombies(env);
    addSurvivors(env);
    if (env.Horde().Length() > 0 && random() > 0.7) { zombieAttack(env); }
  }

  function consumeFood(env) {
    var nb = env.group.Length();
    var consumedFood = random(nb*0.8, nb*1.2);
    if (consumedFood < env.place.food) {
      env.place.food -= consumedFood;
      Display.addMessage("{0} de nourritures ont été consommés.", consumedFood);
    }
    else {
      var diff = consumedFood - env.place.food;
      env.place.food = 0;
      Display.addMessage("Il n'y a plus de nourriture (il aurait fallu {0} de plus).", diff);
    }
  }

  function addZombies(env) {
    var newZombies = random(10, 100);
    env.place.horde.AddZombies(newZombies);
    Display.addMessage("{0} zombies ont été aperçu.", newZombies);
  }

  function addSurvivors(env) {
    if (random() > 0.8) {
      var newSurvivors = Math.round(random(1, 6) / 2);
      env.group.AddSurvivors += newSurvivors;
      Display.addMessage("Vous avez été rejoint par {0} survivants", newSurvivors);
    }
  }

  function zombieAttack(env) {
    var ratio = env.Ratio();
    var killZombies = 0;
    var killSurvivors = 0;
    var damage = 0;
    killZombies = positiveFloor(env.Horde().Length() * random(ratio*50, ratio*100)/100);
    killSurvivors = positiveFloor(env.Group().Length() * random((1-ratio)*50, (1-ratio)*100)/100);
    damage = positiveFloor(env.Place().Defense()*100 * random((1-ratio)*50, (1-ratio)*100)/100);
    env.Horde().removeZombies(killZombies);
    env.Group().removeSurvivors(killSurvivors);
    env.Place().AddDefense(- damage/100);
    Display.addMessage("La zone a été attaquée ! ({0} zombies éliminés, {1} survivants tués, {2}% de dégats)", killZombies, killSurvivors, damage);
    changed();
  }

  function changed() {
    Stats.updateStats();
  }

  Models.createOrder({
    id: "purify",
    name: "Purification",
    time: Models.createTime({
      min: 1,
      standard: 3
    }),
    run: function(env){
      var ratio = env.Ratio();
      var killZombies = 0;
      var killSurvivors = 0;
      killZombies = positiveFloor(env.Horde().Length() * random(ratio*50, ratio*100)/100);
      killSurvivors = positiveFloor(env.Group().Length() * random((1-ratio)*50, (1-ratio)*100)/100);
      env.Horde().KillZombies(killZombies);
      env.Group().KillSurvivors(killSurvivors);
      Display.addMessage("La zone a été purifée ({0} survivants impliqués dont {2} tués, {1} zombies éliminés)", env.Group().Length(), killZombies, killSurvivors);
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

  Models.createOrder({
    id: "fortify",
    name: "Fortification",
    time: Models.createTime({
      min: 1,
      standard: 2
    }),
    run: function(env){
      var tooling = env.Group().Tooling() / 10;
      var max = Math.min(tooling, 1-env.Place().Defense()) * 100;
      var fortifying = random(max/2, max) / 100;
      env.Place().AddDefense(fortifying);
      Display.addMessage("La zone a été fortifiée (de {0}%) par {1} survivants", Math.round(fortifying*100), env.Group().Length());
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
        update: function(env) {
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

  Models.createOrder({
    id: "scavange",
    name: "Fouille",
    time: Models.createTime({
      min: 1,
      standard: 2
    }),
    run: function(env){
      var scavangedFood = random(2, 10);
      env.Place().food += scavangedFood;
      Display.addMessage("Du materiel a été récupéré ({0} nourritures)", scavangedFood);
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

  Stats.createStat({
    id: "turn",
    label: "Tour",
    update: function(){ this.value = turnNb; }
  });
  Stats.createStat({
    id: "ratio",
    label: "Sécurité",
    suffix: " %",
    update: function(){ this.value = to2digits(selectedEnv().Ratio() * 100); }
  });
  Stats.createStat({
    id: "defense",
    label: "Étant du fort",
    suffix: " %",
    update: function(){ this.value = to2digits(selectedPlace().Defense() * 100); }
  });
  Stats.createStat({
    id: "zombies",
    label: "Zombies aux alentour",
    update: function(){ this.value = selectedEnv().Horde().Length(); }
  });
  Stats.createStat({
    id: "survivors",
    label: "Survivants",
    update: function(){
      var value = mainGroup.Length();
      Models.eachMission(function(mission){
        value += mission.group.Length();
      });
      this.value = value;
    }
  });
  Stats.createStat({
    id: "idle",
    label: "Survivants inactif",
    update: function(){ this.value = mainGroup.Length(); }
  });
  Stats.createStat({
    id: "food",
    label: "Nourriture restante",
    update: function(){ this.value = selectedPlace().food; }
  });

  Stats.updateStats();

  // Export
  $.extend(self, {
    sendOrder: sendOrder,
    turn: turn,
    selectSurvivors: selectSurvivors,
    selectOrder: selectOrder
  });

}]);
