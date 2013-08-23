app.factory("Mission", ["$rootScope", "$log", "Env", function ($rootScope, $log, Env) {
  "use strict";

  var missionId = 0;

  function OrderListItem(args) {
    this.path = args.path;
    this.order = args.order;
  }
  OrderListItem.prototype.targetPlace = function () {
    return _.last(this.path);
  };

  var OrderListId = 0;
  function OrderList() {
    this.id = OrderListId++;
    this.orders = [];
    this.currentOrderIndex = 0;
    this.currentPathIndex = 0;
  }
  OrderList.prototype.add = function (args) {
    this.orders.push(new OrderListItem(args));
  };
  OrderList.prototype.currentOrderItem = function () {
    return this.orders[this.currentOrderIndex];
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
  OrderList.prototype.forEach = function (f) {
    _.forEach(this.orders, f);
  };
  OrderList.prototype.isEmpty = function () {
    return this.orders.length == 0;
  }

  function Mission(args) {
    this.id = missionId++;
    this.status = "walking";
    this.orders = new OrderList();
    this.group = args.group;
  }

  Mission.prototype.addOrder = function (path, order) {
    this.orders.add({
      path: path,
      order: order
    });
  };

  Mission.prototype.allOrders = function () {
    return this.orders.orders;
  };
  Mission.prototype.hasOrders = function () {
    return !this.orders.isEmpty();
  };

  Mission.prototype.currentPlace = function () {
    return this.orders.currentPlace();
  };

  Mission.prototype.estimatedTime = function () {
    return 1;
  };

  Mission.prototype.currentEnv = function () {
    var place = this.currentPlace();
    return Env.create({
      group: this.group,
      place: place,
      horde: place.horde
    });
  };

  Mission.prototype.estimatedTimeToComplete = function () {
    return 2;
  };

  Mission.prototype.turn = function (ts) {
    if (this.currentPlace()) {
      this.currentPlace().highlighted = false;
    }
    console.log("TURN for", this);
    var orderItem;
    this.currentPlace.highlighted = false;
    orderItem = this.orders.next();
    console.log("orderItem:", orderItem);
    if (orderItem) {
      this.currentPlace.highlighted = true;
      if (orderItem.order) {
        this.status = "running";
        orderItem.order.run(this.currentEnv());
      } else {
        this.status = "walking";
      }
    } else {
      this.status = "finished";
      remove(this);
      console.log("Mission finished", this);
      return false;
    }
    if (this.currentPlace()) {
      this.currentPlace().highlighted = true;
      this.group.visitPlace(ts, this.currentPlace());
    }
    console.log("Status:", this.status);
  };

  function create(args) {
    return new Mission(args);
  }

  function each(func) {
    var i;
    for (i in $rootScope.missions) {
      func($rootScope.missions[i]);
    }
  }

  function remove(missionToRemove) {
    var newMissions = [], i, mission;
    for (i in $rootScope.missions) {
      mission = $rootScope.currentPlayer.missions[i];
      if (mission.id !== missionToRemove.id) {
        newMissions.push(mission);
      }
    }
    $rootScope.currentPlayer.missions = newMissions;
  }

  return {
    create: create,
    each: each,
    remove: remove
  };

}]);
