var app = angular
  .module("app", ["ngResource", "restangular"])
  .constant("Events", {
    gui: {
      draw: "gui-draw",
      zones: {
        selected: "gui-zones-selected"
      }
    }
  })
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
  .run(["$rootScope", "GBHModels", "Util", "GBHOrders", function ($rootScope, Models, Util, Orders) {
    $rootScope.engine = {};
    $rootScope.game = {};
    $rootScope.gui = {};
    $rootScope.orders = Orders.all();
    $rootScope.currentPlayer = Models.createPlayer();
    $rootScope.newMission = {};
  }])
  .filter("ordersAvailable", function () {
    return function (orders, zone) {
      if (zone) {
        return _.filter(orders, function (order) {
          return order.isAvailableAt(zone.place);
        });
      } else {
        return [];
      }
    };
  });
