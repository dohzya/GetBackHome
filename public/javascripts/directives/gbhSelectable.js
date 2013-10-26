window.app.directive('gbhSelectable', function () {
  "use strict";

  return {
    restrict: "A",
    scope: true,
    link: function ($scope, $element, $attrs, ctrl) {
      $scope.gbhSelectable = $scope.$eval($attrs.gbhSelectable);
      ctrl.onSelect($scope.$eval($attrs.onSelect));
    },
    controller: ["$scope", "$attrs", function ($scope, $attrs) {
      var triggersOnSelect = null;

      function select(item) {
        $scope.gbhSelectable.push(item);
        onSelect();
      }

      function unselect(item) {
        var arr = [];
        var i, selectedItem;
        for (i = 0; i < $scope.gbhSelectable.length; i++) {
          selectedItem = $scope.gbhSelectable[i];
          if (selectedItem !== item) {
            arr.push(selectedItem);
          }
        }
        $scope.gbhSelectable = arr;
      }

      function toggle(item) {
        if (isSelected(item)) {
          unselect(item);
          return false;
        }
        select(item);
        return true;
      }
      
      function isSelected(item) {
        var i;
        for (i = 0; i < $scope.gbhSelectable.length; i++) {
          if ($scope.gbhSelectable[i] === item) {
            return true;
          }
        }
        return false;
      }

      function onSelect(func) {
        if (func) {
          triggersOnSelect = func;
        } else {
          if (triggersOnSelect) {
            triggersOnSelect($scope.gbhSelectable);
          }
        }
      }

      return {
        select: select,
        unselect: unselect,
        toggle: toggle,
        isSelected: isSelected,
        onSelect: onSelect
      };
    }]
  };
});

window.app.directive("gbhSelectableItem", function () {
  "use strict";

  return {
    require: "^gbhSelectable",
    restrict: "A",
    scope: true,
    link: function ($scope, $element, $attrs, gbhSelectable) {
      var item = $scope.$eval($attrs.gbhSelectableItem);

      $element.on("click", function () {
        $scope.$apply(function () {
          $scope.$gbhSelected = gbhSelectable.toggle(item);
        });
      });
    }
  };
});
