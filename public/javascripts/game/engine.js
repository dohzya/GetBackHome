app.service("Engine", ["$rootScope", "Util", "Events", "Places", "Groups", "Env", "Survivors", function ($rootScope, Util, Events, Places, Groups, Env, Survivors) {
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
    var newZombies = Util.random(10, 100);
    place.horde.addZombies(newZombies);
  }

  function addSurvivors(env) {
    if (Util.random() > 0.8) {
      var newSurvivors = Math.round(Util.random(1, 6) / 2);
      env.group.add(Survivors.createSeveral(newSurvivors));
      env.addLog("Survivors joined us ({0} new survivors)", newSurvivors);
    }
  }

  function zombieAttack(env) {
    var ratio = env.ratio();
    var killZombies = 0;
    var killSurvivors = 0;
    var damage = 0;
    killZombies = Util.positiveFloor(env.horde().length() * Util.random(ratio * 50, ratio * 100) / 100);
    killSurvivors = Util.positiveFloor(env.group.length()  *  Util.random((1 - ratio) * 50, (1 - ratio) * 100) / 100);
    damage = Util.positiveFloor(env.place.defense() * 100  *  Util.random((1 - ratio) * 50, (1 - ratio) * 100) / 100);
    env.addLog(
      "Attaque zombie (zombies killed: {0}, survivors killed: {1}, damage: {2})",
      killZombies,
      killSurvivors,
      damage
    );
    env.horde().removeZombies(killZombies);
    env.group.killSurvivors(killSurvivors, env);
    env.place.addDefense(-damage / 100);
  }

  function turnForPlace(place) {
    var env;
    addZombies(place);
    place.endTurn($rootScope.engine.turnNb);
    _.each(place.missions, function (mission) {
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
