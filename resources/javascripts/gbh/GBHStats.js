app.service("GBHStats", ["$rootScope", "GBHLogger", function ($rootScope, Logger) {
  "use strict";

  var self = this;

  function Stat(args) {
    this.id = args.id;
    this.label = args.label;
    this.suffix = args.suffix;
    this.value = args.value;
    this.update = args.update;
  }
  function createStat(args) {
    var stat = new Stat(args);
    $rootScope.stats.push(stat);
    return stat;
  }
  function updateStats() {
    for (var i in $rootScope.stats) {
      var stat = $rootScope.stats[i];
      stat.update();
    }
  }

  var actions = {};

  // Export
  $.extend(self, {
    createStat: createStat,
    updateStats: updateStats
  });

}]);
