app.controller("NewMissionCtrl", ["$scope", "$rootScope", "Events", "Engine", "Missions", function ($scope, $rootScope, Events, Engine, Missions) {
  "use strict";

  var $ = window.jQuery;

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
      console.log($scope.selection.path);
      $scope.selection.order.path = $scope.selection.path;
    }
  }

  function updateMissionPlaces(mission) {
    mission.orders.forEach(function (orderItem) {
      orderItem.targetPlace().hasOrder = true;
      _.forEach(orderItem.path, function (place) {
        place.inPath = true;
      });
    });
  }

  function clearMissionPlaces(mission) {
    mission.orders.forEach(function (orderItem) {
      orderItem.targetPlace().hasOrder = false;
      _.forEach(orderItem.path, function (place) {
        place.inPath = false;
        place.selected = false;
      });
    });
  }

  $scope.selectMission = function (mission) {
    $scope.selection.mission = mission;
    updateMissionPlaces(mission);
  };


  $scope.selectOrder = $scope.doAction(function (order) {
    var orderItem = Missions.createOrderListItem({order: order, data: {}});

    _.each(orderItem.order.inputs, function (input) {
      orderItem.data[input.name] = input.type.default;
    });

    $scope.selection.order = orderItem;
    updateSelectedOrder();
  });

  $scope.isOrderSelected = function (order) {
    return $scope.selection.order && $scope.selection.order.order.id === order.id;
  };

  $scope.$on(Events.gui.zones.selected, function () {
    updateSelectedOrder();
  });

  $scope.addOrder = $scope.doAction(function () {
    if (!$rootScope.newMission) {
      $rootScope.newMission = Missions.create({
        group: $rootScope.engine.mainGroup,
        fromBase: $scope.selection.base,
        toBase: $scope.selection.base
      });
    }
    $rootScope.newMission.orders.add($scope.selection.order);
    updateMissionPlaces($rootScope.newMission);
    $scope.selection.order = undefined;
  });

  $scope.sendMission = $scope.doAction(function () {

    clearMissionPlaces($rootScope.newMission);
    $scope.selection.clearPath();

    $rootScope.currentPlayer().missions.push($rootScope.newMission);
    $rootScope.newMission = undefined;
    $rootScope.$broadcast(Events.gui.draw);
  });

}]);
