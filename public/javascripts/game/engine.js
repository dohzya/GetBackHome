app.service("Engine", ["$rootScope", "Util", "Events", "Places", "Groups", "Env", function ($rootScope, Util, Events, Places, Groups, Env) {
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

  function addZombies(env) {
    var newZombies = Util.random(10, 100);
    env.place.horde.addZombies(newZombies);
  }

  function addSurvivors(env) {
    if (Util.random() > 0.8) {
      var newSurvivors = Math.round(Util.random(1, 6) / 2);
      env.group.addSurvivors += newSurvivors;
    }
  }

  function zombieAttack(env) {
    console.log("zombieAttack env = ", env);
    var ratio = env.ratio();
    var killZombies = 0;
    var killSurvivors = 0;
    var damage = 0;
    killZombies = Util.positiveFloor(env.horde().length() * Util.random(ratio * 50, ratio * 100) / 100);
    killSurvivors = Util.positiveFloor(env.group.length()  *  Util.random((1 - ratio) * 50, (1 - ratio) * 100) / 100);
    damage = Util.positiveFloor(env.place.defense() * 100  *  Util.random((1 - ratio) * 50, (1 - ratio) * 100) / 100);
    env.log.addMessage(
      "Attaque zombie (zombies killed: {0}, survivors killed: {1}, damage: {2})",
      killZombies,
      killSurvivors,
      damage
    );
    env.horde().removeZombies(killZombies);
    env.group.removeSurvivors(killSurvivors);
    env.place.addDefense(-damage / 100);
  }

  function turnForPlace(place) {
    var env;
    place.endTurn($rootScope.engine.turnNb);
    _.each(place.groups, function (group) {
      env = Env.create({
        place: place,
        group: group
      });
      consumeFood(env);
      addZombies(env);
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
        console.log(mission.group.log);
      }
    });
    turnForPlaces();
    _.forEach(player.bases, function (base) {
      console.log(base.group.log);
    });
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
