app.service("GBHDisplay", ["$rootScope", "GBHLogger", function ($rootScope, Logger) {

  var self = this;

  function formatMessage(msg, args, base) {
    return msg.replace(/\{(\d+)\}/g, function(_, n){
      return ""+args[parseInt(n, 10) + base];
    });
  }

  function addOrder(order) {
    $rootScope.orders.push(order);
  }
  function resetOrders() {
    $rootScope.orders = [];
  }

  var $logsVisibleContents = $("#ghb-frame-logs .gbh-visible-contents");
  var $logsContents = $logsVisibleContents.find(".gbh-contents");
  function addMessage(msg) {
    var scroll = $logsVisibleContents.scrollTop() + $logsVisibleContents.height();
    var cur = $logsContents.height();
    $rootScope.logs.push(makeUnique({msg: formatMessage(msg, arguments, 1)}));
    setTimeout(function(){
      if (scroll >= cur) {
        $logsVisibleContents.scrollTop($logsContents.height() - $logsVisibleContents.height());
      }
    }, 10);
  };

  var stats = {};
  function addStat(id, label, suffix) {
    var stat = {id: id, label: label, suffix: suffix};
    stats[id] = stat;
    $rootScope.stats.push(stat);
  };
  function updateStat(id, value) {
    var stat = stats[id];
    var msg = (typeof(value) == "string") ? formatMessage(value, arguments, 2) : ""+value;
    if (stat) { stat.value = msg; }
  };

  var actions = {};
  function addAction(order) {
    var stats = {};
    var statsList = [];
    for (var id in order.action.stats) {
      if (order.action.stats.hasOwnProperty(id)) {
        var stat = order.action.stats[id];
        stats[stat.id] = stat;
        statsList.push(stat);
      }
    }
    var action = {
      id: order.id,
      name: order.action.name,
      order: order,
      stats: stats,
      statsList: statsList,
      visible: order.action.visible !== false
    };
    actions[order.id] = action;
    updateActions();
  };
  function updateAction(order) {
    Logger.trace("updateAction({0})", order);
    updateActions();
  }
  function showAction(id) {
    Logger.trace("showAction({0})", id);
    var action = actions[id];
    if (action) {
      Logger.trace("Show action {0}", action);
      action.visible = true;
    }
    updateActions();
  }
  function hideAction(id) {
    Logger.trace("hideAction({0})", id);
    var action = actions[id];
    if (action) {
      Logger.trace("Hide action {0}", action);
      action.visible = false;
    }
    updateActions();
  }
  function updateActions() {
    $rootScope.actions = [];
    for (var id in actions) {
      if (actions.hasOwnProperty(id)) {
        var action = actions[id];
        if (action.visible) {
          $rootScope.actions.push(action);
        }
      }
    }
  }

  function addButton(action) {
    $rootScope.buttons.push(action);
  }

  function addMission(mission) {
    // $rootScope.missions.push(mission);
  }

  var id = 0;
  function makeUnique(obj) {
    if (!obj.id) { obj.id = id++; }
    return obj;
  }

  // addStat("turn", "Tour");
  // addStat("ratio", "Sécurité", " %");
  // addStat("defense", "Étant du fort", " %");
  // addStat("zombies", "Zombies aux alentour");
  // addStat("survivors", "Survivants");
  // addStat("idle", "Survivants inactif");
  // addStat("food", "Nourriture restante");
  // addAction("scavange", "Fouiller", {"safe": ["Sécurité", " %"], "loot": "Récolte"});
  // addAction("convert", "Amenager", {"build": ["Avancement", " %"]});

  // Export
  $.extend(self, {
    addOrder: addOrder,
    resetOrders: resetOrders,
    addMessage: addMessage,
    addStat: addStat,
    updateStat: updateStat,
    addAction: addAction,
    updateAction: updateAction,
    showAction: showAction,
    hideAction: hideAction,
    addButton: addButton,
    addMission: addMission
  });

}]);
