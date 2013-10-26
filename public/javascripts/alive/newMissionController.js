app.controller("NewMissionCtrl", ["$scope", "$rootScope", "Events", "Selection", "Engine", "Missions", function ($scope, $rootScope, Events, Selection, Engine, Missions) {
  "use strict";

  $scope.selectMission = function (mission) {
    $scope.selection.mission = mission;
  };

  $scope.unselectMission = function () {
    $scope.selection.mission = undefined;
  };

  $scope.selectOrder = $scope.doAction(function (order) {
    var orderItem = Missions.createOrderListItem({order: order, data: {}});

    _.each(orderItem.order.inputs, function (input) {
      orderItem.data[input.name] = input.type.default;
    });

    $scope.selection.order = orderItem;
  });

  $scope.isOrderSelected = function (order) {
    return Selection.isOrderSelected(order);
  };

  $scope.addOrder = $scope.doAction(function () {
    if (!$rootScope.newMission) {
      $rootScope.newMission = Missions.create({
        fromBase: $scope.selection.base,
        toBase: $scope.selection.base
      });
    }

    $scope.selection.order.place = $scope.selection.zone.place;
    $scope.selection.order.path = $scope.selection.path;
    $rootScope.newMission.orders.add($scope.selection.order);

    $scope.selection.order = undefined;
    Selection.clearPath();
    $rootScope.$broadcast(Events.gui.draw);
  });

  $scope.sendMission = $scope.doAction(function () {
    $rootScope.newMission.group = $rootScope.newMission.fromBase.extractSurvivors($scope.selection.survivors);
    $rootScope.currentPlayer().missions.push($rootScope.newMission);
    $rootScope.newMission = undefined;
    $scope.selection.zone = undefined;
    $scope.selection.survivors.splice(0, Number.MAX_VALUE);
    $rootScope.$broadcast(Events.gui.draw);
  });

}]);
