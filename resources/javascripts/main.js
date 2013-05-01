"use strict"

var app = angular.module("app", ["ngResource"])
  .constant("Config", {
    apiUrl: "http://localhost:9200\:9200/api/v1"
  })
  .constant("Events", {

  })
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "/views/index",
        controller: "IndexCtrl"
      })
      .otherwise({
        redirectTo: "/"
      })
  }])
  .config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode(false)
  }]);
