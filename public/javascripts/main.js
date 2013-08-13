"use strict"

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
  .run(["$rootScope", "GBHModels", function ($rootScope, Models) {
    $rootScope.game = {};
    $rootScope.gui = {};
    $rootScope.currentPlayer = Models.createPlayer();

    $rootScope.orders = {};
    var orders = [
      {
        id: "fortify",
        name: "Fortifier",
        time: Models.createTime({min: 1, standard: 3}),
        run: function(env) {
          var tooling = env.group().tooling() / 10;
          var max = Math.min(tooling, 1 - env.place().defense()) * 100;
          var fortifying = random(max/2, max) / 100;
          env.place().addDefense(fortifying);
          return true;
        }
      },
      {
        id: "purify",
        name: "Purifier",
        time: Models.createTime({min: 1, standard: 3}),
        run: function(env) {
          var tooling = env.group().tooling() / 10;
          var max = Math.min(tooling, 1 - env.place().defense()) * 100;
          var fortifying = random(max/2, max) / 100;
          env.place().addDefense(fortifying);
          return true;
        }
      }
    ];

    _.each(orders, function(order) {
      $rootScope.orders[order.id] = Models.createOrder(order);
    });
  }]);
