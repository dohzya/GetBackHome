app.service("Engine", ["$rootScope", "$log", "Util", "Events", "Places", "Orders", "Groups", "Missions", "Env", "Times", "GBHActions", "Map", function ($rootScope, $log, Util, Events, Places, Orders, Groups, Missions, Env, Times, Actions, Map) {
  "use strict";

  var self = this;

  var mainEnv;

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
    var ratio = env.ratio();
    var killZombies = 0;
    var killSurvivors = 0;
    var damage = 0;
    killZombies = Util.positiveFloor(env.horde().length() * Util.random(ratio * 50, ratio * 100) / 100);
    killSurvivors = Util.positiveFloor(env.group.length()  *  Util.random((1 - ratio) * 50, (1 - ratio) * 100) / 100);
    damage = Util.positiveFloor(env.place.defense() * 100  *  Util.random((1 - ratio) * 50, (1 - ratio) * 100) / 100);
    env.horde().removeZombies(killZombies);
    env.group.removeSurvivors(killSurvivors);
    env.place.addDefense(-damage / 100);
  }

  function turnForPlace(place) {
    place.endTurn($rootScope.engine.turnNb);
  }

  function turnForPlaces() {
    Places.forEach(turnForPlace);
    $rootScope.engine.mainGroup.visitPlace($rootScope.engine.turnNb, $rootScope.engine.mainPlace);
  }

  function turnForEnv(env) {
    consumeFood(env);
    addZombies(env);
    addSurvivors(env);
    if (env.horde().length() > 0 && Util.random() > 0.7) { zombieAttack(env); }
  }

  function turn() {
    _.forEach($rootScope.currentPlayer().missions, function (mission) {
      if (mission) {  // TODO fix this creepy line
        mission.turn($rootScope.engine.turnNb);
      }
    });
    $rootScope.engine.turnNb++;
    turnForEnv(mainEnv);
    turnForPlaces();
    $rootScope.$broadcast(Events.gui.draw);
  }

  // Global
  $rootScope.engine.turnNb = 0;
  $rootScope.engine.mainGroup = Groups.create(10);

  // When everything is ready, start the engine!
  $rootScope.engine.mainPlace = $rootScope.selection.base.place;
  mainEnv = Env.create({
    group: $rootScope.engine.mainGroup,
    place: $rootScope.engine.mainPlace
  });
  turnForPlaces();

  // Export
  $.extend(self, {
    turn: turn
  });

}]);
