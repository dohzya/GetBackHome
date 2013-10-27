app.factory('Selection', ['$rootScope', function ($rootScope) {
  'use strict';

  var selection = {
    base: $rootScope.currentPlayer().getPrimaryBase(),
    survivors: [],
    mission: undefined,
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

  function isInPath(place) {
    return _.any(selection.path, function (p) {
      return place === p;
    });
  }

  function getMission() {
    return $rootScope.newMission || selection.mission;
  }

  function isOrderSelected(order) {
    return selection.order && selection.order.order.id === order.id;
  };

  return _.extend(selection, {
    clearSurvivors: clearSurvivors,
    clearPath: clearPath,
    clearZone: clearZone,
    isInPath: isInPath,
    clearOrder: clearOrder,
    getMission: getMission,
    isOrderSelected: isOrderSelected
  });
}]);
