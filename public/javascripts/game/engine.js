app.service("Engine", ["$rootScope", "Util", "Events", "Places", "Survivors", function ($rootScope, Util, Events, Places, Survivors) {
  "use strict";

  var self = this;

  function consumeFood(env) {
    var nb = env.group.length();
    var consumedFood = Util.random(nb * 0.8, nb * 1.2);
    if (consumedFood < env.place.food) {
      env.place.food -= consumedFood;
    } else {
      env.place.food = 0;
    }
  }

  function addZombies(place) {
    if (Util.random() > 0.8) {
      place.horde.addZombies(Util.random(0, 5));
    }
  }

  function addSurvivors(env) {
    if (Util.random() > 0.9) {
      var newSurvivors = Math.round(Util.random(1, 2));
      env.group.add(Survivors.createSeveral(newSurvivors));
      env.addLog(
        "Survivors joined us ({0} new S, {1} S remaining)",
        newSurvivors,
        env.group.length()
      );
    }
  }

  function zombieAttack(env) {
    var ratio = env.ratio();
    var killZombies = 0;
    var killSurvivors = 0;
    env.addLog(
      "Zombie Attack ! (S: {0}, Z: {1}, R: {2}% vs {3}%)",
      env.group.length(),
      env.horde().length(),
      Util.perc(ratio.survivors),
      Util.perc(ratio.zombies)
    );
    killZombies = Math.round(env.horde().length() * Util.random(ratio.survivors * 50, ratio.survivors * 100) / 100);
    killSurvivors = Math.round(env.group.length() * Util.random(ratio.zombies * 50, ratio.zombies * 100) / 100);
    env.horde().removeZombies(killZombies);
    env.group.killSurvivors(killSurvivors, env);
    env.addLog(
      "Attaque zombie (Z killed: {0}, S killed: {1}, {2} S remaining)",
      killZombies,
      killSurvivors,
      env.group.length()
    );
  }

  function turnForPlace(place) {
    var env;
    addZombies(place);
    place.endTurn($rootScope.engine.turnNb);
    _.forEach(place.missions, function (mission) {
      env = mission.currentEnv(place);
      consumeFood(env);
      addSurvivors(env);
      if (place.horde.length() > 0 && Util.random() > 0.7) { zombieAttack(env); }
    });
  }

  function turnForPlaces() {
    Places.forEach(turnForPlace);
    $rootScope.currentPlayer().visitBases($rootScope.engine.turnNb);
  }

  function turn() {
    var player = $rootScope.currentPlayer();
    _.forEach(player.missions, function (mission) {
      if (mission) {  // TODO fix this creepy line
        mission.turn($rootScope.engine.turnNb);
      }
    });
    turnForPlaces();
    $rootScope.engine.turnNb++;
    $rootScope.$broadcast(Events.gui.draw);
  }

  // Global
  $rootScope.engine.turnNb = 0;
  $rootScope.engine.mainBase = $rootScope.currentPlayer().getPrimaryBase();
  $rootScope.engine.mainGroup = $rootScope.engine.mainBase.group;
  $rootScope.engine.mainPlace = $rootScope.engine.mainBase.place;

  // When everything is ready, start the engine!
  turnForPlaces();

  // Export
  $.extend(self, {
    turn: turn
  });

}]);
