app.factory("Player", [function () {

  function Player(args) {
    this.logs = [];
    this.stats = [];
    this.buttons = [];
    this.missions = [];
  }

  function create(args) {
    return new Player(args);
  }

  return {
    create: create
  };

}]);