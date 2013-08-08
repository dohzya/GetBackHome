app.controller("GBHOrders", ["$scope", "GBHEngine", function ($scope, Engine) {
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

  $scope.game.selectedSurvivors = Engine.selectSurvivors(0);
  $scope.game.selectedOrder = null;

  $scope.nextTurn = doAction(function(){ Engine.turn(); });

  $scope.sendOrder = doAction(function(id){
    Engine.sendOrder(id);
    $scope.game.selectedSurvivors = Engine.selectSurvivors(0);
  });

  $scope.selectSurvivors = doAction(function(selectedSurvivors){
    $scope.game.selectedSurvivors = Engine.selectSurvivors(selectedSurvivors);
  });

  $scope.selectOrder = doAction(function(selectedOrder){
    $scope.currentOrder = Engine.selectOrder(selectedOrder);
  });

}]);
