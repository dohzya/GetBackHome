app.controller("GBHCtrl", ["$scope", "GBHEngine", "GBHLogger", function ($scope, Engine, Logger) {
  "use strict";

  var self = this;

  $scope.nextTurn = function(){ Engine.turn(); };

  $scope.action = function(id){ Engine.doAction(id) };

  $scope.select = function(){ Engine.select($scope.selected); };

}]);
