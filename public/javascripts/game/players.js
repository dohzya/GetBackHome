window.app.factory("Players", [function () {
  "use strict";

  var players = [];
  var current;

  function Player() {
    this.stats = [];
    this.buttons = [];
    this.missions = [];
    this.bases = [];
  }

  Player.prototype.getPrimaryBase = function () {
    return _.find(this.bases, function (base) {
      return base.isPrimary;
    });
  };

  Player.prototype.visitBases = function (turnNb) {
    _.forEach(this.bases, function (base) {
      base.visit(turnNb);
    });
  };

  Player.create = function () {
    return new Player();
  };

  function init(base) {
    var currentPlayer = Player.create();
    currentPlayer.bases.push(base);
    players.push(currentPlayer);
    current = currentPlayer;
  }

  return {
    init: init,
    create: Player.create,
    all: function () { return players; },
    current : function () { return current; }
  };

}]);
