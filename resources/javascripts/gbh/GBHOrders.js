app.service("GBHOrders", ["GBHDisplay", "GBHLogger", function (Display, Logger) {
  "use strict";

  var self = this;

  var orders,      // defined orders
      sentOrders;  // orders sent to some survivors

  var sentOrders = [];
  function ordersTurn() {
    var newOrders = [];
    for (var i in sentOrders) {
      var order = sentOrders[i];
      order.turnToComplete--;
      if (order.turnToComplete <= 0) { order.run(); }
      else {
        order.onTurn();
        newOrders.push(order);
      }
    }
    sentOrders = newOrders;
    refreshOrders();
  }
  function refreshOrders() {
    Display.resetOrders();
    for (var i in sentOrders) {
      Display.addOrder(sentOrders[i]);
    }
  }

  function defineOrder(_order) {
    var order = {
      id: _order.id,
      name: _order.name,
      turns: _order.turns,
      onSend: _order.onSend,
      onSelect: _order.onSelect,
      onTurn: _order.onTurn ? function(){ _order.onTurn(defaultOnTurn) } : defaultOnTurn,
      run: _order.run
    };
    if (_order.action) {
      order.action = {
        order: order,
        name: _order.action.name ? _order.action.name : _order.name,
        update: (_order.action.update ? function(){ _order.action.update(defaultUpdate) } : defaultUpdate),
        stats: _order.action.stats,
        visible: _order.action.visible
      };
      Display.addAction(order);
    }
    orders[order.id] = order;
    return order;
  }

  function updateAction(action) {
    for (var stat in action.stats) {
      if (action.stats.hasOwnProperty(stat)) {
        action.stats[stat].update();
      }
    }
    Display.updateAction(action);
  }

  function defaultOnTurn(){}

  function defaultUpdate(){ updateAction(this); }

  var sentOrdersId = 0;
  function sendOrder(id, data) {
    if (!data) { data = {}; }
    var template = orders[id];
    var order = new Object(template)
    order.id = sentOrdersId++;
    if (order.turns) { order.turnToComplete = order.turns; }
    if (data.survivors) { order.survivrs = data.survivors; }
    if (order.onSend) { order.onSend(data); }
    sentOrders.push(order);
    refreshOrders();
    // Display.addOrder(order);
  }

  function foreach(f) {
    for (var order in orders) {
      if (orders.hasOwnProperty(order)) { f(orders[order]); }
    }
  }

  function updateActions() {
    foreach(function(order) {
      if (order.action && order.action.update) { order.action.update(); }
    });
  }

  // Init
  orders = {};
  sentOrders = [];

  // Export
  $.extend(self, {
    ordersTurn: ordersTurn,
    refreshOrders: refreshOrders,
    defineOrder: defineOrder,
    sendOrder: sendOrder,
    updateActions: updateActions
  });

}]);
