var app = (function (angular) {
  "use strict";

  return angular
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
    .run(["$rootScope", "Players", "Groups", "Places", "Bases", "Survivors", function ($rootScope, Players, Groups, Places, Bases, Survivors) {
      // Hack to init a default player
      var base = Bases.create({
        place: Places.at(7, 3),
        isPrimary: true,
        group: Groups.create({ survivors: Survivors.createSeveral(10) })
      });
      Players.init(base);
      $rootScope.currentPlayer = Players.current;
    }])
    .run(["$rootScope", "$log", "Orders", "Selection", function ($rootScope, $log, Orders, Selection) {
      $rootScope.$log = $log;

      $rootScope.engine = {};
      $rootScope.game = {};
      $rootScope.gui = {};

      $rootScope.orders = Orders.all;
      $rootScope.newMission = undefined;

      $rootScope.selection = Selection;
    }])
    .filter("ordersAvailable", function () {
      return function (orders, zone) {
        if (zone) {
          return _.filter(orders, function (order) {
            return order.isAvailableAt(zone.place);
          });
        }
        return [];
      };
    });

}(window.angular));
