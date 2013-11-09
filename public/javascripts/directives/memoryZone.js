window.app.directive('memoryZone', ["$rootScope", function ($rootScope) {
  "use strict";

  return {
    restrict: "E",
    replace: true,
    scope: {},
    link: function(scope, elem, attr) {
      function updateTurnAgo() {
        if(scope.memory) {
          scope.turnAgo = scope.turnNb - scope.memory.ts;
        }
      }

      $rootScope.$watch("engine.turnNb", function (turnNb) {
        scope.turnNb = turnNb;

        if(scope.place) {
          scope.memory = $rootScope.currentPlayer().getPrimaryBase().group.memory.itemForPlace(scope.place);
          updateTurnAgo();
        }
      }, true);

      $rootScope.$watch("selection.zone", function (zone) {
        if (zone) {
          scope.zone = zone;
          scope.place = zone.place;
          scope.memory = $rootScope.currentPlayer().getPrimaryBase().group.memory.itemForPlace(scope.place);
          updateTurnAgo();
        } else {
          scope.zone = null;
          scope.place = null;
          scope.memory = null;
        }
      });
    },
    template: '<div ng-switch="memory">' +
    '<div ng-switch-when="null"><h3>Unknow zone<span ng-show="place"> {{place.x()}} x {{place.y()}}</span></h3></div>' +
    '<div ng-switch-default>' +
      '<h3>Zone {{place.x()}} x {{place.y()}} ({{turnAgo}} turn{{ turnAgo > 1 ? "s" : "" }} ago)</h3>' +
      '<dl>' +
        '<dt>Biome</dt><dd>{{place.biome}}</dd>' +
        '<dt>Structure</dt><dd>{{memory.structure ? memory.structure : "None"}}</dd>' +
        '<dt>Memory</dt><dd>{{memory}}</dd>' +
      '</dl>' +
    '</div>' +
    '</div>'
  }
}]);