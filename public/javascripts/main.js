var app = angular
  .module("app", ["restangular", "ui.router"])
  .constant("Config", {
    hexjs: {
      clean: true,
      heuristic: function (place1, place2) {
        return place1.distanceTo(place2);
      }
    }
  })
  .constant("Events", {
    gui: {
      draw: "gui-draw",
      zones: {
        selected: "gui-zones-selected"
      }
    }
  })
  .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'views/index'
      });
  }])
  .config(["RestangularProvider", function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
  }])
  .config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix("!");
  }])
  .run(["$rootScope", "$log", "Players", "Util", "Orders", "Groups", "Places", "Bases", "Survivors", function ($rootScope, $log, Players, Util, Orders, Groups, Places, Bases, Survivors) {
    $rootScope.$log = $log;

    $rootScope.engine = {};
    $rootScope.game = {};
    $rootScope.gui = {};

    $rootScope.orders = Orders.all;

    var base = Bases.create({
      place: Places.at(7, 3),
      isPrimary: true,
      group: Groups.create({ survivors: Survivors.createSeveral(10) })
    });
    Players.init(base);
    $rootScope.currentPlayer = Players.current;
    $rootScope.newMission = undefined;

    $rootScope.selection = {
      base: $rootScope.currentPlayer().getPrimaryBase(),
      survivors: []
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
