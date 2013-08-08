app.controller("GBHCtrl", ["$scope", function ($scope) {
  "use strict";

  $scope.views = {
    selectedView: "orders"
  };

  $scope.game = {};
  $scope.gui = {};

  $scope.selectView = function(name) {
    $scope.views.selectedView = name;
  };
  $scope.viewClass = function(name) {
    if (name === $scope.views.selectedView) { return "show"; }
    else { return "hide"; }
  };

}]);
