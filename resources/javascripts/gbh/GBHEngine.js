app.service("GBHEngine", ["GBHDisplay", "GBHLogger", "GBHOrders", "GBHModels", "GBHActions", function (Display, Logger, Orders, Models, Actions) {
  "use strict";

  function changeSelection(selected) {
    $("#selected").val(selected);
  }

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

  function positive(nb) {
    return Math.max(nb, 0);
  }

  function positiveRound(nb) {
    return Math.round(positive(nb));
  }

  function positiveFloor(nb) {
    return Math.floor(positive(nb));
  }

  function sendLocalOrder(name) {
    Logger.trace("send local order '"+ name +"'");
    if (selected != 0) {
      var survivors = sendSelected();
      Orders.sendOrder(name, {survivors: survivors}, mainEnv);
      changed();
    }
  }

  function purify() { sendLocalOrder("purify"); }
  function scavange() {
    if (selected == 0) { return; }
    var survivors = sendOrderSelected();
    Orders.addOrder({
      msg: "Fouiller",
      survivors: survivors,
      turns: 2,
      run: function(){
        var scavangedFood = random(2, 10);
        mainEnv.food += scavangedFood;
        Display.addMessage("Du materiel a été récupéré ({0} nourritures)", scavangedFood);
        changed();
      }
    });
    changed();
  }
  function fortify() { sendLocalOrder("fortify"); }
  function convert() {
    var survivors = sendOrderSelected();
    Display.addMessage("La zone a été amenagée");
    changed();
  }
  function zombieAttack() {
    var ratio = computeRatio(mainEnv.idle, mainEnv.zombies, mainEnv.defense, COEF_DEFENSE);
    var killZombies = 0;
    var killSurvivors = 0;
    var damage = 0;
    killZombies = positiveFloor(mainEnv.zombies * random(ratio*50, ratio*100)/100);
    killSurvivors = positiveFloor(mainEnv.survivors * random((1-ratio)*50, (1-ratio)*100)/100);
    damage = positiveFloor(mainEnv.defense*100 * random((1-ratio)*50, (1-ratio)*100)/100);
    mainEnv.zombies -= killZombies;
    mainEnv.survivors -= killSurvivors;
    mainEnv.defense -= damage/100;
    Display.addMessage("La zone a été attaquée ! ({0} zombies éliminés, {1} survivants tués, {2}% de dégats)", killZombies, killSurvivors, damage);
    changed();
  }

  function old_turn() {
    resetSelected();
    Orders.ordersTurn();
    var consumedFood = random(mainEnv.survivors*0.8, mainEnv.survivors*1.2);
    if (consumedFood < mainEnv.food) {
      mainEnv.food -= consumedFood;
      Display.addMessage("{0} de nourritures ont été consommés.", consumedFood);
    }
    else {
      var diff = consumedFood - mainEnv.food;
      mainEnv.food = 0;
      Display.addMessage("Il n'y a plus de nourriture (il aurait fallu {0} de plus).", diff);
    }
    var newZombies = random(10, 100);
    mainEnv.zombies += newZombies;
    Display.addMessage("{0} zombies ont été aperçu.", newZombies);
    if (random() > 0.8) {
      var newSurvivors = Math.round(random(1, 6) / 2);
      mainEnv.survivors += newSurvivors;
      Display.addMessage("Vous avez été rejoin par {0} survivants", newSurvivors);
    }
    if (mainEnv.zombies > 0 && random() > 0.7) zombieAttack();
    turnNb++;
    Display.addMessage("Tour {0}.", turnNb);
    changed();
  }

  function updateStats() {
    Display.updateStat("turn", turnNb);
    Display.updateStat("ratio", Math.round(computeRatio(mainEnv.idle, mainEnv.zombies, mainEnv.defense, mainEnv.coef)*100));
    Display.updateStat("defense", Math.round(mainEnv.defense*100));
    Display.updateStat("zombies", mainEnv.zombies);
    Display.updateStat("survivors", mainEnv.survivors);
    Display.updateStat("idle", mainEnv.idle);
    Display.updateStat("food", "{0} ({1} | {2} jours)", mainEnv.food, -mainEnv.survivors, Math.round(mainEnv.food / mainEnv.survivors));
  }

  function updateActions() {
    Orders.updateActions();
    Display.updateAction("scavange", {"safe": 100, "loot": 100});
    Display.showAction("scavange");
    Display.showAction("fortify");
  }

  function changed() {
    updateStats();
    updateActions();
  }

  function computeRatio(nbSurvivors, nbZombies, defense, coef) {
    var r = (nbSurvivors * defense  * coef) / nbZombies;
    return Math.max(Math.min(0.999, r), 0.01);
  }

  function select(s) {
    selected = Math.min(s, mainEnv.idle);
    if (selected != s) { changeSelection(selected); }
    changed();
    return selected;
  }
  function sendSelected() {
    var s = selected;
    mainEnv.idle -= selected;
    selected = 0;
    changeSelection(0);
    return s;
  }
  function resetSelected() {
    selected = 0;
    changeSelection(0);
    mainEnv.idle = mainEnv.survivors;
  }

  // Global
  var turnNb = 0;
  var selected = 0;

  // Stats
  var totalSurvivors;
  var totalKilledZombies;
  var totalKilledSurvivors;

  // Main
  var mainGroup = Models.createGroup(10);
  var mainPlace = Models.createPlace({
    food: 100,
    defense: 1,
    horde: Models.createHorde(100)
  });
  var mainEnv = Models.createEnv({
    group: mainGroup,
    place: mainPlace
  });

  // Orders.defineOrder({
  //   id: "purify",
  //   name: "Purification",
  //   coefRatio: 20,
  //   turns: 2,
  //   run: function(){
  //     console.log(this);
  //     console.log(this.env);
  //     var ratio = computeRatio(this.env.survivors, this.env.zombies, random(70, 130)/100, this.coefRatio);
  //     var killZombies = 0;
  //     var killSurvivors = 0;
  //     killZombies = positiveFloor(this.env.zombies * random(ratio*50, ratio*100)/100);
  //     killSurvivors = positiveFloor(this.env.survivors * random((1-ratio)*50, (1-ratio)*100)/100);
  //     this.env.zombies -= killZombies;
  //     this.env.survivors -= killSurvivors;
  //     Display.addMessage("La zone a été purifée ({0} survivants impliqués dont {2} tués, {1} zombies éliminés)", this.env.survivors, killZombies, killSurvivors);
  //     changed();
  //   },
  //   onSend: function(){},
  //   action: {
  //     name: "Purifier",
  //     stats: {
  //       safe: {
  //         id: "safe",
  //         name: "Sécurité",
  //         value: 0,
  //         suffix: "%",
  //         update: function() {
  //           this.value = Math.round(computeRatio(selected, mainEnv.zombies, 1, this.order.coefRatio)*100);
  //         }
  //       }
  //     }
  //   }
  // });

  var order = Models.createOrder({
    id: "fortify",
    name: "Fortifier",
    time: Models.createTime({
      min: 1,
      standard: 2
    }),
    run: function(){
      var fortifying = random(10, 50) / 100;
      this.group.tooling += fortifying;
      Display.addMessage("La zone a été fortifiée (de {0}%)", Math.round(fortifying*100));
      changed();
      return true;
    }
  });
  var action = Actions.createAction({
    id: "fortify",
    name: "Fortifier",
    stats: {
      build: Actions.createStat({
        id: "build",
        name: "Avancement",
        value: 100
      })
    },
    order: "fortify"
  });
  Display.addButton(action);

  function splitGroup(group, nb) {
    var removed = [];
    for (var i=0; i<nb; i++) {
      removed.push(group.survivors.shift());
    }
    return Models.createGroup({
      survivors: removed
    });
  }

  function doAction(id) {
    var mission = Models.createMission({
      order: Actions.action(id).order,
      group: splitGroup(mainGroup, 10)  // s/10/selected/
    });
    Display.addMission(mission);
  }

  function turn() {
    Models.eachMission(function(mission){
      mission.turn();
    });
  }

  // Orders.defineOrder({
  //   id: "fortify",
  //   name: "Fortifier",
  //   turns: 3,
  //   run: function(){
  //     var fortifying = random(10, 50) / 100;
  //     this.env.defense += fortifying;
  //     Display.addMessage("La zone a été fortifiée (de {0}%)", Math.round(fortifying*100));
  //     changed();
  //   },
  //   action: {
  //     name: "Fortifier",
  //     stats: {
  //       build: {
  //         id: "build",
  //         name: "Avancement",
  //         value: 100
  //       }
  //     }
  //   }
  // });

  resetSelected();
  changed();

  // Export
  $.extend(self, {
    doAction: doAction,
    turn: turn,
    select: select
  });

}]);
