app.service("Orders", ["GBHDisplay", "$log", "Util", "Times", function (Display, $log, Util, Times) {
  "use strict";

  function Order(args) {
    this.id = args.id;
    this.name = args.name;
    this.icon = args.icon;
    this.description = args.description;
    this.inputs = args.inputs || [];
    this.time = args.time;
    this.onWalk = args.onWalk || Util.noop;
    this.onTurn = args.onTurn || Util.noop;
    this.onRun = args.onRun || Util.noop;
    this.onReturn = args.onReturn || Util.noop;
    this.isAvailableAt = args.isAvailableAt || function () { return true; };
    this.isValid = args.isValid || function () { return true; };
    this.run = args.run;
    this.finish = args.finish;
  }

  function create(args) {
    return new Order(args);
  }

  var inputTypes = {
    home: {
      id: "home",
      "default": true,
      template: '<input type="checkbox" ng-model="value"/>'
    },
    survivors: {
      id: "survivors",
      "default": 1,
      min: 1,
      template: '<input type="number" class="form-control" ng-model="value"/>'
    }
  };

  var rawOrders = [
    {
      id: "purify",
      name: "Purification",
      icon: "fire",
      description: "",
      inputs: [
        {
          type: inputTypes.survivors,
          name: "survivors"
        }
      ],
      time: Times.create({
        min: 1,
        standard: 3
      }),
      run: function (env) {
        var ratio = env.ratio();
        var killZombies = 0;
        var killSurvivors = 0;
        killZombies = positiveFloor(env.horde().length() * random(ratio * 50, ratio * 100) / 100);
        killSurvivors = positiveFloor(env.group.length() * random((1 - ratio) * 50, (1 - ratio) * 100) / 100);
        env.horde().killZombies(killZombies);
        env.group.killSurvivors(killSurvivors);
        Display.addMessage(
          "La zone a été purifée ({0} survivants impliqués dont {2} tués, {1} zombies éliminés)",
          env.group.length(),
          killZombies,
          killSurvivors
        );
      },
      finish: function () {
        finishMission(this);
        return true;
      }
    },
    {
      id: "fortify",
      name: "Fortification",
      icon: "building",
      description: "",
      time: Times.create({
        min: 1,
        standard: 2
      }),
      run: function (env) {
        var tooling = env.group.tooling() / 10;
        var max = Math.min(tooling, 1 - env.place.defense()) * 100;
        var fortifying = random(max / 2, max) / 100;
        env.place.addDefense(fortifying);
        Display.addMessage(
          "La zone a été fortifiée (de {0}%) par {1} survivants",
          Math.round(fortifying * 100),
          env.group.length()
        );
      },
      finish: function () {
        finishMission(this);
        return true;
      }
    }
  ];

  var orders = {};
  _.each(rawOrders, function (order) {
    orders[order.id] = create(order);
  });

  var self = this;

  var templates,   // defined templates
      sentOrders;  // orders sent to some survivors

  var sentOrders = [];
  function ordersTurn() {
    var newOrders = [], i, order;
    for (i in sentOrders) {
      order = sentOrders[i];
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
    var i;
    Display.resetOrders();
    for (i in sentOrders) {
      Display.addOrder(sentOrders[i]);
    }
  }

  function defineOrder(_template) {
    var template = $.extend({}, _template, {
      onTurn: _template.onTurn ? function () { _template.onTurn(defaultOnTurn) } : defaultOnTurn,
    });
    var stat;
    if (_template.action) {
      template.action = $.extend({}, _template.action, {
        order: template,
        name: _template.action.name ? _template.action.name : _template.name,
        update: (_template.action.update ? function () { _template.action.update(defaultUpdate) } : defaultUpdate)
      });
      for (stat in template.action.stats) {
        template.action.stats[stat].order = template;
      }
      Display.addAction(template);
    }
    templates[template.id] = template;
    return template;
  }

  function updateAction(action) {
    var stat;
    for (stat in action.stats) {
      if (action.stats.hasOwnProperty(stat)) {
        if (action.stats[stat].update) {
          action.stats[stat].update();
        }
      }
    }
    Display.updateAction(action);
  }

  function defaultOnTurn() {}

  function defaultUpdate() {
    updateAction(this);
  }

  var sentOrdersId = 0;
  function sendOrder(id, data, env) {
    var template = templates[id];
    var order = Object.create(template);
    order.id = sentOrdersId++;
    if (!env) { env = {}; }
    order.env = $.extend(Object.create(env), data || {});
    if (order.turns) { order.turnToComplete = order.turns; }
    if (order.onSend) { order.onSend(); }
    sentOrders.push(order);
    refreshOrders();
  }

  function updateActions() {
    var id, order;
    for (id in templates) {
      if (templates.hasOwnProperty(id)) {
        order = templates[id];
        if (order.action && order.action.update) { order.action.update(); }
      }
    }
  }

  // Init
  templates = {};
  sentOrders = [];

  // Export
  return {
    create: create,
    all: function () { return orders; },
    get: function (idOrder) { return orders[idOrder] },
    ordersTurn: ordersTurn,
    refreshOrders: refreshOrders,
    defineOrder: defineOrder,
    sendOrder: sendOrder,
    updateActions: updateActions
  };

}]);
