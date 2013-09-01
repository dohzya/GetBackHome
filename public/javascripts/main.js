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
  .run(["$rootScope", "$log", "Players", "Util", "Orders", function ($rootScope, $log, Players, Util, Orders) {
    $rootScope.$log = $log;

    $rootScope.engine = {};
    $rootScope.game = {};
    $rootScope.gui = {};
    $rootScope.orders = Orders.all();
    $rootScope.currentPlayer = Players.create();
    $rootScope.newMission = undefined;

    $rootScope.selection = {
      selectPath: function (newPath) {
        $rootScope.selection.clearPath();
        $rootScope.selection.path = newPath;
        _.forEach($rootScope.selection.path, function (place) {
          place.selected = true;
        });
      },
      clearPath: function () {
        _.forEach($rootScope.selection.path, function (place) {
          place.selected = false;
        });
      }
    };
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
