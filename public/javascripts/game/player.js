app.factory("Player", [function () {
  "use strict";

  function Player() {
    this.logs = [];
    this.stats = [];
    this.buttons = [];
    this.missions = [];
  }

  function create() {
    return new Player();
  }

  return {
    create: create
  };

}]);
