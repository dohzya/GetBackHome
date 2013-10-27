app.controller("NewMissionCtrl", ["$scope", "$rootScope", "Events", "Selection", "Engine", "Missions", function ($scope, $rootScope, Events, Selection, Engine, Missions) {
  "use strict";

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
    if (!$rootScope.newMission) {
      $rootScope.newMission = Missions.create({
        fromBase: Selection.base,
        toBase: Selection.base
      });
    }

    Selection.order.path = Selection.path;

    $rootScope.newMission.orders.add(Selection.order);

    Selection.clearOrder();
    Selection.clearPath();

    $rootScope.$broadcast(Events.gui.draw);
  };

  $scope.sendMission = function () {
    $rootScope.newMission.group = $rootScope.newMission.fromBase.extractSurvivors(Selection.survivors);
    $rootScope.currentPlayer().missions.push($rootScope.newMission);

    $rootScope.newMission = undefined;
    Selection.clearZone();
    Selection.clearSurvivors();

    $rootScope.$broadcast(Events.gui.draw);
  };

}]);
