app.factory("Missions", [function () {
  function each(func) {
    _.forEach($rootScope.currentPlayer.missions, func);
  }

  function remove(missionToRemove) {
    $rootScope.currentPlayer.missions = _.filter($rootScope.currentPlayer.missions, function (mission) {
      return mission.id !== missionToRemove.id;
    });
  }

  return {
    each: each,
    remove: remove
  }
}]);