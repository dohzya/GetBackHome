app.factory("Players", ["Bases", "Groups", "Survivors", function (Bases, Groups, Survivors) {
  "use strict";

  var players = [];
  var current;

  function Player() {
    this.logs = [];
    this.stats = [];
    this.buttons = [];
    this.missions = [];
    this.bases = [];
  }

  Player.prototype.getPrimaryBase = function () {
    return _.find(this.bases, function (base) {
      return base.isPrimary;
    });
  }

  function create() {
    return new Player();
  }

  function init(place) {
    var currentPlayer = create();
    currentPlayer.bases.push(Bases.create({
      place: place,
      isPrimary: true,
      group: Groups.create({ survivors: Survivors.createSeveral(10) })
    }));
    players.push(currentPlayer);
    current = currentPlayer;
  }

  return {
    init: init,
    create: create,
    all: function () { return players; },
    current : function () { return current; }
  };

}]);
