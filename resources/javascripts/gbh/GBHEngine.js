app.service("GBHEngine", ["GBHDisplay", "GBHLogger", "GBHOrders", function (Display, Logger, Orders) {
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

  function sendOrder(name) {
    Logger.trace("send order '"+ name +"'");
    if (selected != 0) {
      var survivors = sendSelected();
      Orders.sendOrder(name, {survivors: survivors});
      changed();
    }
  }

  function purify() { sendOrder("purify"); }
  function scavange() {
    if (selected == 0) { return; }
    var survivors = sendSelected();
    Orders.addOrder({
      msg: "Fouiller",
      survivors: survivors,
      turns: 2,
      run: function(){
        var scavangedFood = random(2, 10);
        food += scavangedFood;
        Display.addMessage("Du materiel a été récupéré ({0} nourritures)", scavangedFood);
        changed();
      }
    });
    changed();
  }
  function fortify() { sendOrder("fortify"); }
  function convert() {
    var survivors = sendSelected();
    Display.addMessage("La zone a été amenagée");
    changed();
  }
  function zombieAttack() {
    var ratio = computeRatio(idle, zombies, defense, COEF_FORT);
    var killZombies = 0;
    var killSurvivors = 0;
    var damage = 0;
    killZombies = positiveFloor(zombies * random(ratio*50, ratio*100)/100);
    killSurvivors = positiveFloor(survivors * random((1-ratio)*50, (1-ratio)*100)/100);
    damage = positiveFloor(defense*100 * random((1-ratio)*50, (1-ratio)*100)/100);
    zombies -= killZombies;
    survivors -= killSurvivors;
    defense -= damage/100;
    Display.addMessage("La zone a été attaquée ! ({0} zombies éliminés, {1} survivants tués, {2}% de dégats)", killZombies, killSurvivors, damage);
    changed();
  }

  function turn() {
    resetSelected();
    Orders.ordersTurn();
    var consumedFood = random(survivors*0.8, survivors*1.2);
    if (consumedFood < food) {
      food -= consumedFood;
      Display.addMessage("{0} de nourritures ont été consommés.", consumedFood);
    }
    else {
      var diff = consumedFood - food;
      food = 0;
      Display.addMessage("Il n'y a plus de nourriture (il aurait fallu {0} de plus).", diff);
    }
    var newZombies = random(10, 100);
    zombies += newZombies;
    Display.addMessage("{0} zombies ont été aperçu.", newZombies);
    if (random() > 0.8) {
      var newSurvivors = Math.round(random(1, 6) / 2);
      survivors += newSurvivors;
      Display.addMessage("Vous avez été rejoins par {0} survivants", newSurvivors);
    }
    if (zombies > 0 && random() > 0.7) zombieAttack();
    turnNb++;
    Display.addMessage("Tour {0}.", turnNb);
    changed();
  }

  function updateStats() {
    Display.updateStat("turn", turnNb);
    Display.updateStat("ratio", Math.round(computeRatio(idle, zombies, defense, COEF_FORT)*100));
    Display.updateStat("defense", Math.round(defense*100));
    Display.updateStat("zombies", zombies);
    Display.updateStat("survivors", survivors);
    Display.updateStat("idle", idle);
    Display.updateStat("food", "{0} ({1} | {2} jours)", food, -survivors, Math.round(food / survivors));
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
    selected = Math.min(s, idle);
    if (selected != s) { changeSelection(selected); }
    changed();
    return selected;
  }
  function sendSelected() {
    var s = selected;
    idle -= selected;
    selected = 0;
    changeSelection(0);
    return s;
  }
  function resetSelected() {
    selected = 0;
    changeSelection(0);
    idle = survivors;
  }

  var turnNb = 0;
  var survivors = 10,
      food = 50;
  var defense = 1,
      zombies = 100;
  var selected = 0,
      idle = 0;
  var COEF_FORT = 10,
      COEF_PURIFY = 20;

  Orders.defineOrder({
    id: "purify",
    name: "Purification",
    turns: 2,
    run: function(){
      console.log("this = ", this)
      console.log("this.survivors = ", this.survivors)
      var ratio = computeRatio(this.survivors, zombies, random(70, 130)/100, COEF_PURIFY);
      var killZombies = 0;
      var killSurvivors = 0;
      killZombies = positiveFloor(zombies * random(ratio*50, ratio*100)/100);
      killSurvivors = positiveFloor(this.survivors * random((1-ratio)*50, (1-ratio)*100)/100);
      zombies -= killZombies;
      survivors -= killSurvivors;
      Display.addMessage("La zone a été purifée ({0} survivants impliqués dont {2} tués, {1} zombies éliminés)", this.survivors, killZombies, killSurvivors);
      changed();
    },
    action: {
      name: "Purifier",
      stats: {
        safe: {
          id: "safe",
          name: "Sécurité",
          value: 0,
          suffix: "%",
          update: function() {
            this.value = Math.round(computeRatio(selected, zombies, 1, COEF_PURIFY)*100);
          }
        }
      }
    }
  });

  Orders.defineOrder({
    id: "fortify",
    name: "Fortifier",
    turns: 3,
    run: function(){
      var fortifying = random(10, 50) / 100;
      defense += fortifying;
      Display.addMessage("La zone a été fortifiée (de {0}%)", Math.round(fortifying*100));
      changed();
    },
    action: {
      name: "Fortifier",
      stats: {
        build: {
          id: "build",
          name: "Avancement",
          value: 100
        }
      }
    }
  });

  resetSelected();
  changed();

  // Export
  $.extend(self, {
    purify: purify,
    scavange: scavange,
    fortify: fortify,
    convert: convert,
    zombieAttack: zombieAttack,
    turn: turn,
    select: select
  });

}]);
