app.service("GBHDisplay", ["$rootScope", function ($rootScope) {

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
  function addAction(id, name) {
    var action = {id: id, name: name, action: id};
    actions[id] = action;
    updateActions()
  };
  function updateAction(id, ratio) {
    var action = actions[id];
    if (action) { action.ratio = ratio; }
    updateActions();
  }
  function updateActions() {
    $rootScope.actions = [];
    for (id in actions) {
      if (actions.hasOwnProperty(id)) {
        var action = actions[id];
        if (action.ratio) {
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
  addAction("purify", "Purifier");
  addAction("scavange", "Fouiller");
  addAction("fortify", "Fortifier");
  addAction("convert", "Amenager");

  // Export
  $.extend(self, {
    addMessage: addMessage,
    addLog: addLog,
    addStat: addStat,
    updateStat: updateStat,
    addAction: addAction,
    updateAction: updateAction
  });

}]);
