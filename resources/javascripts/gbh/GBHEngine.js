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

  function select(s) {
    selected = Math.min(s, mainGroup.Length());
    if (selected != s) { changeSelection(selected); }
    return selected;
  }
  setTimeout(function(){ changeSelection(0) }, 10);

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

  function sendSelected(nb) {
    var group = splitGroup(mainGroup, nb);
    selected = 0;
    changeSelection(selected);
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

  // Export
  $.extend(self, {
    doAction: doAction,
    turn: turn,
    select: select
  });

}]);
