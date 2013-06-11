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

  $scope.sendOrder = doAction(function(id){ Engine.sendOrder(id); });

  $scope.selectSurvivors = doAction(function(){ Engine.selectSurvivors($scope.selectedSurvivors); });

  $scope.selectOrder = doAction(function(){
    $scope.currentOrder = Engine.selectOrder($scope.selectedOrder);
  });

}]);
