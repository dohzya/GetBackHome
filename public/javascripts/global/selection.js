app.factory('Selection', ['$rootScope', 'Missions', function ($rootScope, Missions) {
  'use strict';

  var selection = {
    base: $rootScope.currentPlayer().getPrimaryBase(),
    survivors: [],
    mission: undefined,
    isNewMission: false,
    order: undefined,
    zone: undefined,
    path: []
  };

  function clearSurvivors() {
    selection.survivors = [];
  }

  function clearPath() {
    selection.path = [];
  }

  function clearZone() {
    selection.zone = undefined;
  }

  function clearOrder() {
    selection.order = undefined;
  }

  function clearMission() {
    selection.mission = undefined;
    selection.isNewMission = false;
  }

  function isInPath(place) {
    return _.any(selection.path, function (p) {
      return place === p;
    });
  }

  function selectMission(mission) {
    selection.isNewMission = false;
    selection.mission = mission;
  }

  function startNewMission() {
    selection.isNewMission = true;
    selection.mission = Missions.create({
      fromBase: selection.base,
      toBase: selection.base
    });
  }


  function getMission() {
    return selection.mission;
  }

  function isOrderSelected(order) {
    return selection.order && selection.order.order.id === order.id;
  };

  return _.extend(selection, {
    clearSurvivors: clearSurvivors,
    clearPath: clearPath,
    clearZone: clearZone,
    clearOrder: clearOrder,
    clearMission: clearMission,
    isInPath: isInPath,
    selectMission: selectMission,
    startNewMission: startNewMission,
    getMission: getMission,
    isOrderSelected: isOrderSelected
  });
}]);
