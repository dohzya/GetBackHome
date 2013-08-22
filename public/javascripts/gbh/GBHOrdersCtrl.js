app.controller("GBHOrders", ["$scope", "$rootScope", "Events", "GBHEngine", "GBHModels",
  function ($scope, $rootScope, Events, Engine, Models) {
  "use strict";

  $scope.$on(Events.gui.zones.selected, function () {
    //$scope.selection.order = undefined;
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
    order = {
      value: order,
      data: {}
    };

    _.each(order.value.inputs, function (input) {
      order.data[input.name] = input.type.default;
    });

    $scope.selection.order = order;
  });

  $scope.isOrderSelected = function (order) {
    return $scope.selection.order && $scope.selection.order.value.id === order.id;
  };

  $scope.addOrder = $scope.doAction(function () {
    if (!$scope.selection.mission) {
      $scope.selection.mission = Models.createMission();
    }

    $scope.selection.mission.orders.push($scope.selection.order);
  });

  $scope.createMission = $scope.doAction(function () {
    console.log("createMission", $rootScope.newMission);
    $rootScope.currentPlayer.missions.push($rootScope.newMission);
    $rootScope.newMission = {};
  });

}]);
