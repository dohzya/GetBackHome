app.service("GBHDisplay", ["$rootScope", "GBHLogger", function ($rootScope, Logger) {

  var self = this;

  var MAX_MESSAGE = 5;

  function formatMessage(msg, args, base) {
    return msg.replace(/\{(\d+)\}/g, function(_, n){
      return ""+args[parseInt(n, 10) + base];
    });
  }

  function addMessage(msg) {
    var m = formatMessage(msg, arguments, 1);
    if ($rootScope.messages.length > MAX_MESSAGE) {
      $rootScope.messages.shift();
    }
    $rootScope.messages.push(makeUnique({msg: m}));
    addLog(m);
  };

  var $logsVisibleContents = $("#ghb-frame-logs .gbh-visible-contents");
  var $logsContents = $logsVisibleContents.find(".gbh-contents");
  function addLog(msg) {
    var scroll = $logsVisibleContents.scrollTop() + $logsVisibleContents.height();
    var cur = $logsContents.height();
    $rootScope.logs.push(makeUnique({msg: msg}));
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
    var msg = typeof(value) == "string" ? formatMessage(value, arguments, 2) : ""+value;
    if (stat) { stat.value = msg; }
  };

  var actions = {};
  function addAction(id, name, stats) {
    var _stats = {};
    var _statsList = [];
    for (stat in stats) {
      if (stats.hasOwnProperty(stat)) {
        var s = stats[stat];
        var _stat;
        if (typeof(s) == "string") { _stat = {id: stat, name: s}; }
        else { _stat = {id: stat, name: s[0], suffix: s[1]}; }
        _stats[stat] = _stat;
        _statsList.push(_stat);
      }
    }
    var action = {id: id, name: name, action: id, stats: _stats, statsList: _statsList, visible: false};
    actions[id] = action;
    updateActions();
  };
  function updateAction(id, stats) {
    Logger.trace("updateAction({0}, {1})", id, stats);
    var action = actions[id];
    if (action) {
      for (stat in stats) {
        if (stats.hasOwnProperty(stat)) {
          Logger.debug("Update stat {0} of action {0}", stat, action)
          action.stats[stat].value = stats[stat];
        }
      }
    }
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
    for (id in actions) {
      if (actions.hasOwnProperty(id)) {
        var action = actions[id];
        if (action.visible) {
          $rootScope.actions.push(action);
        }
      }
    }
  }

  var id = 0;
  function makeUnique(obj) {
    obj.id = id++;
    return obj;
  }

  addStat("turn", "Tour");
  addStat("ratio", "Sécurité", " %");
  addStat("defense", "Étant du fort", " %");
  addStat("zombies", "Zombies aux alentour");
  addStat("survivors", "Survivants");
  addStat("idle", "Survivants inactif");
  addStat("food", "Nourriture restante");
  addAction("purify", "Purifier", {"safe": ["Sécurité", " %"]});
  addAction("scavange", "Fouiller", {"safe": ["Sécurité", " %"], "loot": "Récolte"});
  addAction("fortify", "Fortifier", {"build": "Avancement"});
  addAction("convert", "Amenager", {"build": ["Avancement", " %"]});

  // Export
  $.extend(self, {
    addMessage: addMessage,
    addLog: addLog,
    addStat: addStat,
    updateStat: updateStat,
    addAction: addAction,
    updateAction: updateAction,
    showAction: showAction,
    hideAction: hideAction
  });

}]);
