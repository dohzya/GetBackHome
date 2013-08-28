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



  function updateSelectedOrder () {
    if ($scope.selection.order) {
      $scope.selection.order.place = $scope.selection.zone.place;
      $scope.selection.order.path = $scope.selection.path;
    }
  }

  function updateMissionPlaces (mission) {
    _.forEach(mission.orders, function (order) {
      order.place.hasOrder = true;
      _.forEach(order.path, function (place) {
        place.inPath = true;
      });
    });
  }

  function clearMissionPlaces (mission) {
    _.forEach(mission.orders, function (order) {
      order.place.hasOrder = false;
      _.forEach(order.path, function (place) {
        place.selected = false;
        place.inPath = false;
      });
    });
  }

  $scope.selectMission = function (mission) {
    $scope.selection.mission = mission;
    updateMissionPlaces(mission);
  };


  $scope.selectOrder = $scope.doAction(function (order) {
    order = {
      value: order,
      data: {}
    };

    _.each(order.value.inputs, function (input) {
      order.data[input.name] = input.type.default;
    });

    $scope.selection.order = order;
    updateSelectedOrder();
  });

  $scope.isOrderSelected = function (order) {
    return $scope.selection.order && $scope.selection.order.value.id === order.id;
  };

  $scope.$on(Events.gui.zones.selected, function () {
    updateSelectedOrder();
  });

  $scope.addOrder = $scope.doAction(function () {
    if (!$rootScope.newMission) {
      $rootScope.newMission = Models.createMission({});
    }

    $rootScope.newMission.orders.push($scope.selection.order);
    updateMissionPlaces($rootScope.newMission);
    $scope.selection.order = undefined;
  });

  $scope.createMission = $scope.doAction(function () {

    clearMissionPlaces($rootScope.newMission)
    $scope.selection.clearPath();

    $rootScope.currentPlayer.missions.push($rootScope.newMission);
    $rootScope.newMission = undefined;
    $rootScope.$broadcast(Events.gui.draw);
  });

}]);
