app.factory('Selection', ['$rootScope', function ($rootScope) {
  'use strict';

  function selectPath(newPath) {
    $rootScope.selection.path = newPath;
  }

  function clearPath() {
    selectPath(undefined);
  }

  function isInPath(place) {
    return _.any($rootScope.selection.path, function (p) {
      return place === p;
    });
  }

  function getMission() {
    return $rootScope.newMission || $rootScope.selection.mission;
  }

  return {
    clearPath: clearPath,
    selectPath: selectPath,
    isInPath: isInPath,
    getMission: getMission
  };
}]);
