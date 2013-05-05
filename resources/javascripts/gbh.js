window.GBH = (function($){
  "use strict";

  var self = {
  };

  var gui, engine;

  function init() {
    self.gui.init();
    self.engine.init();
    $("#turn").click(function(){
      self.engine.turn();
    })
    self.engine.turn();

    // init data
    self.gui.addMessage("L'hôpital a été attaqué par une horde de zombies !");
    self.gui.addMessage("Les zombies ont été tués !");
    self.gui.addMessage("Marie Relache est morte !");
    self.gui.addMessage("Julien Martin est mort !");
    self.gui.addMessage("Marc Turque est blessé !");
    self.gui.addMessage("Le garage a été purifié !");
    self.gui.addMessage("Une horde a été repérée près de la piscine.");
    self.gui.addMessage("La fortification du mur Nord avance bien. Estimation du temps restant : 8h.");
    self.gui.addMessage("L'hôpital a été attaqué par une horde de zombies !");
    self.gui.addMessage("Les zombies ont été tués !");
    self.gui.addMessage("Marie Relache est morte !");
    self.gui.addMessage("Julien Martin est mort !");
    self.gui.addMessage("Marc Turque est blessé !");
    self.gui.addMessage("Le garage a été purifié !");
    self.gui.addMessage("Une horde a été repérée près de la piscine.");
    self.gui.addMessage("La fortification du mur Nord avance bien. Estimation du temps restant : 8h.");

  }

  $.extend(self, {
    init: init
  });

  return self;

})(jQuery);
