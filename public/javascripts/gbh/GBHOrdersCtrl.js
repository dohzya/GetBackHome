app.controller("GBHOrders", ["$scope", "$rootScope", "Events", "GBHEngine", function ($scope, $rootScope, Events, Engine) {
  "use strict";

  $scope.$on(Events.gui.zones.selected, function () {
    $rootScope.newMission = {};
  });

  $scope.game.selectedSurvivors = Engine.selectSurvivors(0);
  $scope.game.selectedOrder = null;

  $scope.sendOrder = $scope.doAction(function (id) {
    Engine.sendOrder(id);
    $scope.game.selectedSurvivors = Engine.selectSurvivors(0);
  });

  $scope.selectSurvivors = $scope.doAction(function (selectedSurvivors) {
    $scope.game.selectedSurvivors = Engine.selectSurvivors(selectedSurvivors);
  });

  // $scope.selectOrder = $scope.doAction(function (selectedOrder) {
  //   $scope.currentOrder = Engine.selectOrder(selectedOrder);
  // });





  $scope.selectOrder = $scope.doAction(function (order) {
    $scope.newMission.order = order;
    $scope.newMission.data = {};
    _.each(order.inputs, function (input) {
      $scope.newMission.data[input.name] = input.type.default;
    });
  });

  $scope.isOrderSelected = function (order) {
    return $scope.newMission.order && $scope.newMission.order.id === order.id;
  };

}]);
