app.directive("gbhInputOrder", ["$compile", function ($compile) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      type: "=",
      value: "="
    },
    link: function (scope, element, attrs) {
      element.html(scope.type.template);
      $compile(element.contents())(scope);
    }
  };
}])