app.controller("AppCtrl", ["$rootScope", "$scope", "Events", "Engine", function ($rootScope, $scope, Events, Engine) {
  "use strict";

  var inAction = false;

  $scope.doAction = function (func) {
    return function () {
      if (!inAction) {
        inAction = true;
        func.apply(this, arguments);
        inAction = false;
      }
    };
  };

  $scope.nextTurn = $scope.doAction(function () { Engine.turn(); });

}]);
