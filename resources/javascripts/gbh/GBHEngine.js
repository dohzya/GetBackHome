app.service("GBHEngine", ["GBHDisplay", function (Display) {
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

  function positive(nb) {
    return Math.max(nb, 0);
  }

  function positiveRound(nb) {
    return Math.round(positive(nb));
  }

    function positiveFloor(nb) {
    return Math.floor(positive(nb));
  }

  function purify() {
    var ratio = computeRatio(survivors, zombies, random(70, 130)/100, COEF_PURIFY);
    var killZombies = 0;
    var killSurvivors = 0;
    var damage = 0;
    killZombies = positiveFloor(zombies * random(ratio*50, ratio*100)/100);
    killSurvivors = positiveFloor(survivors * random((1-ratio)*50, (1-ratio)*100)/100);
    damage = positiveFloor(defense * random((1-ratio)*50, (1-ratio)*100)/100);
    zombies -= killZombies;
    survivors -= killSurvivors;
    defense -= damage;
    Display.addMessage("La zone a été purifée ({0} zombies éliminés, {1} survivants tués)", killZombies, killSurvivors);
    changed();
  }
  function scavange() {
    var scavangedFood = random(2, 10);
    food += scavangedFood;
    Display.addMessage("Du materiel a été récupéré ({0} nourritures)", scavangedFood);
    changed();
  }
  function fortify() {
    var fortifying = random(10, 50) / 100;
    defense += fortifying;
    Display.addMessage("La zone a été fortifiée (de {0}%)", fortifying);
    changed();
  }
  function convert() {
    Display.addMessage("La zone a été amenagée");
    changed();
  }
  function zombieAttack() {
    var ratio = computeRatio(survivors, zombies, defense, COEF_FORT);
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
    Display.updateStat("ratio", Math.round(computeRatio(survivors, zombies, defense, COEF_FORT)*100));
    Display.updateStat("defense", Math.round(defense*100));
    Display.updateStat("zombies", zombies);
    Display.updateStat("survivors", survivors);
    Display.updateStat("idle", idle);
    Display.updateStat("food", "{0} ({1} | {2} jours)", food, -survivors, Math.round(food / survivors));
    Display.updateAction("purify", "Purifier ({0} %)", Math.round(computeRatio(survivors, zombies, 1, COEF_PURIFY)*100))
  }

  function changed() {
    updateStats();
  }

  function computeRatio(nbSurvivors, nbZombies, defense, coef) {
    var r = (nbSurvivors * defense  * coef) / nbZombies;
    return Math.min(1, r);
  }

  var turnNb = 0;

  var survivors = 10;
  var idle = 0;
  var food = 50;

  var defense = 1;
  var zombies = 100;

  var COEF_FORT = 10;
  var COEF_PURIFY = 20;

  changed();

  // Export
  $.extend(self, {
    purify: purify,
    scavange: scavange,
    fortify: fortify,
    convert: convert,
    zombieAttack: zombieAttack,
    turn: turn
  });

}]);
