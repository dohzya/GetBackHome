window.app.directive('gbhSelectable', function () {
  "use strict";

  return {
    restrict: "A",
    scope: true,
    link: function () {

    },
    controller: ["$scope", "$attrs", function ($scope, $attrs) {
      var selectedItems;

      $scope.$watch($attrs.gbhSelectable, function(newValue, oldValue) {
        if (newValue !== selectedItems) {
          selectedItems = newValue;
        }
      }, true);

      var onSelectHandler = $scope.$eval($attrs.gbhSelectableOnSelect);
      var onUnSelectHandler = $scope.$eval($attrs.gbhSelectableOnUnselect);

      function select(item) {
        selectedItems.push(item);
        onSelect(item);
      }

      function unselect(item) {
        selectedItems.splice(selectedItems.indexOf(item), 1);
        onUnselect(item);
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
        return selectedItems.indexOf(item) >= 0;
      }

      function onSelect(item) {
        if (onSelectHandler) {
          onSelectHandler(item);
        }
      }

      function onUnselect(item) {
        if (onUnSelectHandler) {
          onUnSelectHandler(item);
        }
      }

      return {
        select: select,
        unselect: unselect,
        toggle: toggle,
        isSelected: isSelected
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
