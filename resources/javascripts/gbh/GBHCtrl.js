app.controller("GBHCtrl", ["$scope", "$routeParams", "GBHEngine", function ($scope, $routeParams, Engine) {
  "use strict";

  var self = this;

  $scope.purify = function(){ Engine.purify(); }
  $scope.scavange = function(){ Engine.scavange(); }
  $scope.fortify = function(){ Engine.fortify(); }
  $scope.convert = function(){ Engine.convert(); }
  $scope.turn = function(){ Engine.turn(); }

}]);
