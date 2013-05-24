app.service("GBHStats", ["$rootScope", "GBHLogger", function ($rootScope, Logger) {
  "use strict";

  var self = this;

  function Stat(args) {
    this.id = args.id;
    this.name = args.name;
    this.value = args.value;
  }
  function createStat(args) {
    return new Stat(args);
  }

  var actions = {};

  // Export
  $.extend(self, {
    createStat: createStat
  });

}]);
