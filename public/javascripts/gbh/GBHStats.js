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
    Logger.trace("Add stat: {0}", stat);
    $rootScope.currentPlayer.stats.push(stat);
    return stat;
  }
  function updateStats() {
    var i, stat;
    for (i in $rootScope.stats) {
      stat = $rootScope.stats[i];
      stat.update();
    }
  }

  // Export
  $.extend(self, {
    createStat: createStat,
    updateStats: updateStats
  });

}]);
