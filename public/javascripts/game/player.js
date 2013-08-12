app.factory("Player", [function () {

  function Player(args) {
    this.orders = [];
    this.logs = [];
    this.stats = [];
    this.actions = [];
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