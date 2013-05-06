app.service("GBHDisplay", ["$rootScope", function ($rootScope) {

  var self = this;

  var MAX_MESSAGE = 5;

  function addMessage(msg) {
    var args = arguments;
    var m = msg.replace(/\{(\d+)\}/g, function(_, n){
      return ""+args[ parseInt(n, 10) +1];
    });
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

  function addStat(id, label, suffix) {
    $rootScope.stats.push({id: id, label: label, suffix: suffix});
  };
  function updateStat(id, value) {
    var stat = $rootScope.stats.filter(function(s){ return s.id == id; })[0];
    if (stat) {
      stat.value = value;
    }
  };

  function addAction(id, name) {
    $rootScope.actions.push({id: id, name: name, action: id});
  };

  var id = 0;
  function makeUnique(obj) {
    obj.id = id++;
    return obj;
  }

  addStat("turn", "Tour");
  addStat("ratio", "Sécurité");
  addStat("status", "Étant du fort", "%");
  addStat("zombies", "Zombies aux alentour");
  addStat("survivors", "Survivants");
  addStat("idle", "Survivants inactif");
  addStat("food", "Nourriture restante", "j");
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
    addAction: addAction
  });

}]);
