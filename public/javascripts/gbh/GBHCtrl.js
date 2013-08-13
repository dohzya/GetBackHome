app.controller("GBHCtrl", ["$rootScope", "$scope", "GBHEngine", function ($rootScope, $scope, Engine) {
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
  }

  $scope.nextTurn = $scope.doAction(function () { Engine.turn(); });

}]);
