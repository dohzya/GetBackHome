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
    var action = Missions.createAction({order: order});

    _.each(order.inputs, function (input) {
      action.data[input.name] = input.type.default;
    });

    Selection.order = action;
  };

  $scope.isOrderSelected = function (order) {
    return Selection.isOrderSelected(order);
  };

  $scope.addOrder = function () {
    Selection.order.place = _.last(Selection.path);
    Selection.mission.addAction(Selection.order);
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
