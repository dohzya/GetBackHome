app.service("GBHOrders", ["GBHDisplay", "GBHLogger", function (Display, Logger) {
  "use strict";

  var self = this;

  var templates,   // defined templates
      sentOrders;  // orders sent to some survivors

  var sentOrders = [];
  function ordersTurn() {
    var newOrders = [];
    for (var i in sentOrders) {
      var order = sentOrders[i];
      order.turnToComplete--;
      if (order.turnToComplete <= 0) {
        order.run();
      }
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

  function defineOrder(_template) {
    var template = $.extend({}, _template, {
      onTurn: _template.onTurn ? function(){ _template.onTurn(defaultOnTurn) } : defaultOnTurn,
    });
    if (_template.action) {
      template.action = $.extend({}, _template.action, {
        order: template,
        name: _template.action.name ? _template.action.name : _template.name,
        update: (_template.action.update ? function(){ _template.action.update(defaultUpdate) } : defaultUpdate)
      });
      for (var stat in template.action.stats) {
        template.action.stats[stat].order = template;
      }
      Display.addAction(template);
    }
    templates[template.id] = template;
    return template;
  }

  function updateAction(action) {
    for (var stat in action.stats) {
      if (action.stats.hasOwnProperty(stat)) {
        if (action.stats[stat].update) {
          action.stats[stat].update();
        }
      }
    }
    Display.updateAction(action);
  }

  function defaultOnTurn(){}

  function defaultUpdate(){
    updateAction(this); }

  var sentOrdersId = 0;
  function sendOrder(id, data) {
    var template = templates[id];
    var order = Object.create(template)
    order.id = sentOrdersId++;
    order.env = data || {};
    if (order.turns) { order.turnToComplete = order.turns; }
    if (order.onSend) { order.onSend(); }
    sentOrders.push(order);
    refreshOrders();
  }

  function updateActions() {
    for (var id in templates) {
      if (templates.hasOwnProperty(id)) {
        var order = templates[id];
        if (order.action && order.action.update) { order.action.update(); }
      }
    }
  }

  // Init
  templates = {};
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
