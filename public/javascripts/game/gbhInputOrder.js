app.directive("gbhInputOrder", ["$compile", function ($compile) {
  "use strict";

  return {
    restrict: "E",
    replace: true,
    scope: {
      type: "=",
      value: "="
    },
    link: function (scope, element) {
      element.html(scope.type.template);
      $compile(element.contents())(scope);
    }
  };

}]);
