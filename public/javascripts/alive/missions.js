app.factory("Missions", ["$rootScope", "$log", "Env", "Orders", function ($rootScope, $log, Env, Orders) {
  "use strict";

  var missionId = 0;

  function OrderListItem(args) {
    this.estimatedPath = args.path;
    this.path = args.path;
    this.order = args.order;
    this.data = args.data;
    this.finished = false;
  }

  OrderListItem.prototype.nextPlace = function (currentPlace) {
    var currentIndex = _.indexOf(this.path, currentPlace);
    if (currentIndex > -1 && currentIndex < this.path.length) {
      return this.path[currentIndex + 1];
    }
    return this.path[0];
  };

  OrderListItem.prototype.targetPlace = function () {
    return _.last(this.path);
  };

  OrderListItem.prototype.run = function (env) {
    this.order.run(env);
    this.finished = true;
  };

  OrderListItem.prototype.isFinished = function () {
    return this.finished;
  };

  OrderListItem.create = function (args) {
    return new OrderListItem(args);
  };

  var OrderListId = 0;
  function OrderList() {
    this.id = OrderListId++;
    this.orders = [];
    this.currentOrderIndex = 0;
    this.currentPathIndex = 0;
  }

  OrderList.prototype.add = function (args) {
    if (args instanceof OrderListItem) {
      this.orders.push(args);
    } else {
      this.add(new OrderListItem(args));
    }
  };

  OrderList.prototype.currentOrderItem = function () {
    return _.find(this.orders, function (orderItem) {
      return !orderItem.isFinished();
    });
  };

  OrderList.prototype.currentOrder = function () {
    var orderItem = this.currentOrderItem();
    if (orderItem) {
      if (this.currentPathIndex == orderItem.path.length - 1) {
        return orderItem.order;
      }
      return null;  // we might return a Walking order instead?
    }
    return null;
  };

  OrderList.prototype.currentPlace = function () {
    var orderItem = this.currentOrderItem();
    if (orderItem) {
      return orderItem.path[this.currentPathIndex];
    }
    return null;
  };

  OrderList.prototype.current = function () {
    console.log("current:", this);
    var place = this.currentPlace();
    if (place) {
      return {
        place: place,
        order: this.currentOrder()
      };
    }
    return null;
  };

  OrderList.prototype.next = function () {
    this.currentPathIndex++;
    if (!this.currentPlace()) {
      this.currentOrderIndex++;
      this.currentPath = 0;
    }
    return this.current();
  };

  OrderList.prototype.forEach = function (predicate, context) {
    _.forEach(this.orders, predicate, context);
  };

  OrderList.prototype.isEmpty = function () {
    return this.orders.length == 0;
  };

  function Mission(args) {
    this.id = missionId++;
    this.status = "walking";
    this.orders = new OrderList();
    this.group = args.group;
    this.fromBase = args.fromBase;
    this.toBase = args.toBase;
    this.place = this.fromBase.place;
  }

  Mission.prototype.addOrder = function (path, order) {
    this.orders.add({
      path: path,
      order: order
    });
  };

  Mission.prototype.getAllOrders = function () {
    return this.orders.orders;
  };

  Mission.prototype.hasOrders = function () {
    return !this.orders.isEmpty();
  };

  Mission.prototype.forEachOrders = function (predicate, context) {
    return this.orders.forEach(predicate, context);
  };

  Mission.prototype.allOrders = function (predicate, context) {
    return _.all(this.getAllOrders(), predicate, context);
  };

  Mission.prototype.anyOrders = function (predicate, context) {
    return _.any(this.getAllOrders(), predicate, context);
  };

  Mission.prototype.currentPlace = function () {
    return this.orders.currentPlace();
  };

  Mission.prototype.estimatedTime = function () {
    return 1;
  };

  Mission.prototype.currentEnv = function (place) {
    if (place && place != this.place) {
      console.log("MISSION AT THE WRONG PLACE!!", this, place);
    }
    return Env.create({
      group: this.group,
      place: this.place
    });
  };

  Mission.prototype.estimatedTimeToComplete = function () {
    return 2;
  };

  Mission.prototype.turn = function (ts) {
    if (this.place) {
      // We are not in the place anymore
      this.place.removeMission(this);
    }

    var orderItem = this.orders.currentOrderItem();

    if (!orderItem) {
      // No more order? Let's see if we are at destination
      if (this.place === this.toBase.place) {
        // And we are done here
        this.status = "finished";
        Mission.finish(this);
        return false;
      }
      // Let's add a bonus order to move to our final destination
      this.addOrder(this.place.pathTo(this.toBase.place), Orders.get("move"));
      orderItem = this.orders.currentOrderItem();
    }

    if (orderItem) {
      // Something to do!
      if (this.place === orderItem.targetPlace()) {
        // We are in position, let's rock
        this.status = "running";
        orderItem.run(this.currentEnv());
      } else {
        // We need to move to our target point
        this.status = "walking";
        var nextPlace = orderItem.nextPlace(this.place);
        if (nextPlace) {
          this.place = nextPlace;
        }
      }
    }

    if (this.group.length() == 0) {
      // everybody's dead
      Mission.fail(this);
      return false;
    }

    if (this.place) {
      // Here we are
      this.group.visitPlace(ts, this.place);
      this.place.addMission(this);
    }
  };

  Mission.each = function (func) {
    _.forEach($rootScope.currentPlayer().missions, func);
  };

  Mission.remove = function (missionToRemove) {
    $rootScope.currentPlayer().missions = _.filter($rootScope.currentPlayer().missions, function (mission) {
      return mission.id !== missionToRemove.id;
    });
  };

  Mission.finish = function (mission) {
    mission.currentEnv().addLog(
      "Mission finished ({0} survivors returned)",
      mission.group.length()
    );
    $rootScope.engine.mainGroup.merge(mission.group);
    Mission.remove(mission);
  };

  Mission.fail = function (mission) {
    mission.currentEnv().addLog("Mission failed (no more survivors)");
    if (window.DEBUG_BGH) {
      console.log("================================================");
      _.forEach(mission.group.memory.logs.messages, function (message) {
        console.log(message.format())
      });
      console.log("================================================");
    }
    Mission.remove(mission);
  };

  Mission.create = function (args) {
    return new Mission(args);
  };

  return {
    create: Mission.create,
    createOrderListItem: OrderListItem.create,
    each: Mission.each,
    finish: Mission.finish,
    remove: Mission.remove
  };

}]);
