var app = angular
  .module("app", ["ngResource", "restangular"])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "/views/index"
      })
      .otherwise({
        redirectTo: "/"
      });
  }])
  .config(["RestangularProvider", function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
  }])
  .config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix("!");
  }])
  .run(["$rootScope", "GBHModels", "Util", function ($rootScope, Models, Util) {
    $rootScope.game = {};
    $rootScope.gui = {};
    $rootScope.currentPlayer = Models.createPlayer();
  }]);
