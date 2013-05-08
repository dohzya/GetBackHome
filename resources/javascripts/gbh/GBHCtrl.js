app.controller("GBHCtrl", ["$scope", "GBHEngine", "GBHLogger", function ($scope, Engine, Logger) {
  "use strict";

  var self = this;

  $scope.nextTurn = function(){ Engine.turn(); };

  $scope.purify = function(){ Engine.purify(); };
  $scope.scavange = function(){ Engine.scavange(); };
  $scope.fortify = function(){ Engine.fortify(); };
  $scope.convert = function(){ Engine.convert(); };

  $scope.select = function(){ Engine.select($scope.selected); };

}]);
