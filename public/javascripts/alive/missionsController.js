app.controller("MissionsCtrl", ["$scope", "$rootScope", "Events", "Selection", "Engine", "Missions", function ($scope, $rootScope, Events, Selection, Engine, Missions) {
  "use strict";

  $scope.startNewMission = function () {
    Selection.startNewMission();
    $rootScope.$broadcast(Events.gui.draw);
  };

  $scope.selectMission = function (mission) {
    Selection.selectMission(mission);
    $rootScope.$broadcast(Events.gui.draw);
  }

  $scope.selectOrder = function (order) {
    var orderItem = Missions.createOrderListItem({order: order, data: {}});

    _.each(orderItem.order.inputs, function (input) {
      orderItem.data[input.name] = input.type.default;
    });

    Selection.order = orderItem;
  };

  $scope.isOrderSelected = function (order) {
    return Selection.isOrderSelected(order);
  };

  $scope.addOrder = function () {
    Selection.order.path = Selection.path;
    Selection.mission.orders.add(Selection.order);
    Selection.clearOrder();
    Selection.clearPath();

    $rootScope.$broadcast(Events.gui.draw);
  };

  $scope.sendMission = function () {
    Selection.mission.group = Selection.mission.fromBase.extractSurvivors(Selection.survivors);
    $rootScope.currentPlayer().missions.push(Selection.mission);

    Selection.clearMission();
    Selection.clearZone();
    Selection.clearSurvivors();

    $rootScope.$broadcast(Events.gui.draw);
  };

}]);
