"use strict"

var app = angular
  .module("app", ["ngResource", "restangular"])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "/views/index"
      })
      .when("/map", {
        templateUrl: "/views/map",
        controller: "GUICtrl"
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
  .run(["$rootScope", function ($rootScope) {
    $rootScope.orders = [];
    $rootScope.logs = [];
    $rootScope.stats = [];
    $rootScope.actions = [];
    $rootScope.buttons = [];
    $rootScope.missions = [];
  }]);