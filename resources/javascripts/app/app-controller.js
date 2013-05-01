app.controller("AppCtrl", ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {
  $scope.user = user
  $scope.user.id = user.id.$oid

  $scope.data = {
    test: "Azerty",
    number: 51
  }

  $scope.signinForm = {
    username: "",
    password: ""
  }

  $scope.registerForm = {
    username: "",
    password: "",
    email: ""
  }

}])
