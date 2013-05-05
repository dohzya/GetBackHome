window.GBH.engine = (function($, GBH){
  "use strict";

  var self = {
  };

  var status;
  var survivors;
  var zombies;
  var idle;
  var food;

  var turnNb;

  var changeCb;

  function init() {
    changeCb = [function(){ updateStats(); }];
    survivors = 10;
    status = 100;
    zombies = 0;
    idle = 0;
    food = 0;
    turnNb = 0;
    GBH.gui.addStat("turn", "Tour");
    GBH.gui.addStat("status", "Étant du fort", "%");
    GBH.gui.addStat("zombies", "Zombies aux alentour");
    GBH.gui.addStat("survivors", "Survivants");
    GBH.gui.addStat("idle", "Survivants inactif");
    GBH.gui.addStat("food", "Nourriture restante", "j");
    GBH.gui.addAction("purify", "Purifier", function(_){ purify(); });
    GBH.gui.addAction("scavange", "Fouiller", function(_){ scavange(); });
    GBH.gui.addAction("fortify", "Fortifier", function(_){ fortify(); });
    GBH.gui.addAction("convert", "Amenager", function(_){ convert(); });
  }

  function purify() {
    zombies--;
    GBH.gui.addMessage("La zone a été purifée");
    changed();
  }
  function scavange() {
    food++;
    GBH.gui.addMessage("Du materiel a été récupéré");
    changed();
  }
  function fortify() {
    status++;
    GBH.gui.addMessage("La zone a été fortifiée");
    changed();
  }
  function convert() {
    GBH.gui.addMessage("La zone a été amenagée");
    changed();
  }

  function turn() {
    zombies++;
    survivors++;
    status = status - zombies;
    turnNb++;
    changed();
  }

  function updateStats() {
    GBH.gui.updateStat("turn", turnNb);
    GBH.gui.updateStat("status", status);
    GBH.gui.updateStat("zombies", zombies);
    GBH.gui.updateStat("survivors", survivors);
    GBH.gui.updateStat("idle", idle);
    GBH.gui.updateStat("food", food);
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

  $.extend(self, {
    init: init,
    purify: purify,
    scavange: scavange,
    fortify: fortify,
    convert: convert,
    turn: turn,
    onChange: onChange,
    stats: stats
  });

  return self;
})(jQuery, GBH);
