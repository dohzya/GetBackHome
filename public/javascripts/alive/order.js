app.factory("Order", ["Util", function (Util) {

  var orders = {};

  function Order(args) {
    this.id = args.id;
    this.name = args.name;
    this.time = args.time;
    this.onWalk = args.onWalk || Util.noop;
    this.onTurn = args.onTurn || Util.noop;
    this.onRun = args.onRun || Util.noop;
    this.run = args.run;
  }

  function create(args) {
    var order = new Order(args);
    orders[order.id] = order;
    return order;
  }

  function order(id) {
    return orders[id];
  }

  return {
    create: create
  };

}]);