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
      return Math.floor((Math.random() * max) + min);
    }
    else return Math.random();
  }

  function purify() {
    var killZombies = 0;
    var killSurvivors = 0;
    if (! ratio < 1) killZombies = Math.round(zombies * random(5, 30) / 100);
    if (! ratio > 1) killSurvivors = Math.round(survivors * random(5, 30) / 100);
    zombies -= killZombies;
    survivors -= killSurvivors;
    Display.addMessage("La zone a été purifée ({0} zombies éliminés, {1} survivants tués)", killZombies, killSurvivors);
    changed();
  }
  function scavange() {
    food++;
    Display.addMessage("Du materiel a été récupéré");
    changed();
  }
  function fortify() {
    var rest = 100 - status;
    var fortifying = random(rest/10, rest);
    status += fortifying;
    Display.addMessage("La zone a été fortifiée (de {0}%)", fortifying);
    changed();
  }
  function convert() {
    Display.addMessage("La zone a été amenagée");
    changed();
  }
  function zombieAttack() {
    var ratio = (survivors * status) / (zombies * 10);
    var killZombies = 0;
    var killSurvivors = 0;
    var damage = 0;
    if (! ratio < 1) killZombies = Math.round(zombies * random(5, 30) / 100);
    if (! ratio > 1) killSurvivors = Math.round(survivors * random(5, 30) / 100);
    if (ratio < 2) damage = random(0, 20);
    zombies -= killZombies;
    survivors -= killSurvivors;
    status -= damage;
    Display.addMessage("La zone a été attaquée ! ({0} zombies éliminés, {1} survivants tués, {2}% de dégats)", killZombies, killSurvivors, damage);
    changed();
  }

  function turn() {
    zombies += random(10, 100);
    if (random() > 0.8) {
      var nb = Math.round(random(1, 6) / 2);
      survivors += nb;
      Display.addMessage("Vous avez été rejoins par {0} survivants", nb);
    }
    if (random() > 0.7) zombieAttack();
    turnNb++;
    Display.addMessage("Tour {0}.", turnNb);
    changed();
  }

  function updateStats() {
    Display.updateStat("turn", turnNb);
    Display.updateStat("ratio", ratio);
    Display.updateStat("status", status);
    Display.updateStat("zombies", zombies);
    Display.updateStat("survivors", survivors);
    Display.updateStat("idle", idle);
    Display.updateStat("food", food);
  }

  function changed() {
    var s = stats();
    for (var i=0; i<changeCb.length; i++) changeCb[i](s);
  }

  function onChange(cb) {
    changeCb.push(cb);
  }

  function stats() {
    return {
      survivors: survivors,
      status: status,
      zombies: zombies,
      idle: idle,
      food: food
    };
  }

  var changeCb = [
    function(){ ratio = (survivors * 10) / zombies; },
    function(){ updateStats(); }
  ];
  var survivors = 15;
  var ratio;
  var status = 100;
  var zombies = 50;
  var idle = 0;
  var food = 0;
  var turnNb = 0;
  changed();

  // Export
  $.extend(self, {
    purify: purify,
    scavange: scavange,
    fortify: fortify,
    convert: convert,
    zombieAttack: zombieAttack,
    turn: turn,
    stats: stats
  });

}]);
