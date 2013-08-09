app.controller("GBHCtrl", ["$rootScope", "$scope", function ($rootScope, $scope) {
  "use strict";

  $rootScope.views = {
    selectedView: "orders"
  };

  $rootScope.game = {};
  $rootScope.gui = {};

  $scope.selectView = function(name) {
    $scope.views.selectedView = name;
  };
  $scope.viewClass = function(name) {
    if (name === $scope.views.selectedView) { return "show"; }
    else { return "hide"; }
  };

}]);
