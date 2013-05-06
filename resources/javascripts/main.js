"use strict"

var app = angular
  .module("app", ["ngResource"])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "/views/index",
        controller: "GBHCtrl"
      })
      .otherwise({
        redirectTo: "/"
      })
  }])
  .config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode(false)
  }])
  .run(["$rootScope", function ($rootScope) {
    $rootScope.messages = [];
    $rootScope.logs = [];
    $rootScope.stats = [];
    $rootScope.actions = [];
  }]);