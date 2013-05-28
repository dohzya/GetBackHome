app.controller("GBHCtrl", ["$scope", "GBHEngine", function ($scope, Engine) {
  "use strict";

  var inAction = false;

  function doAction(func) {
    return function() {
      if (!inAction) {
        inAction = true;
        func.apply(this, arguments);
        inAction = false;
      }
    };
  }

  $scope.nextTurn = doAction(function(){ Engine.turn(); });

  $scope.action = doAction(function(id){ Engine.doAction(id); });

  $scope.select = doAction(function(){ Engine.select($scope.selected); });

}]);
