app.controller("GBHOrders", ["$scope", "GBHEngine", function ($scope, Engine) {
  "use strict";

  $scope.game.selectedSurvivors = Engine.selectSurvivors(0);
  $scope.game.selectedOrder = null;

  $scope.sendOrder = $scope.doAction(function(id){
    Engine.sendOrder(id);
    $scope.game.selectedSurvivors = Engine.selectSurvivors(0);
  });

  $scope.selectSurvivors = $scope.doAction(function(selectedSurvivors){
    $scope.game.selectedSurvivors = Engine.selectSurvivors(selectedSurvivors);
  });

  $scope.selectOrder = $scope.doAction(function(selectedOrder){
    $scope.currentOrder = Engine.selectOrder(selectedOrder);
  });

}]);
