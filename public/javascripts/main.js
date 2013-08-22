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
  .run(["$rootScope", "$log", "GBHModels", "Util", "GBHOrders", function ($rootScope, $log, Models, Util, Orders) {
    $rootScope.$log = $log;

    $rootScope.engine = {};
    $rootScope.game = {};
    $rootScope.gui = {};
    $rootScope.orders = Orders.all();
    $rootScope.currentPlayer = Models.createPlayer();
    $rootScope.newMission = {};
    $rootScope.selection = {};
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
