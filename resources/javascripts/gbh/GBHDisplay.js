app.service("GBHDisplay", ["$rootScope", function ($rootScope) {

  var self = this;

  var MAX_MESSAGE = 5;

  self.addMessage = function(msg) {
    var args = arguments;
    var m = msg.replace(/\{(\d+)\}/g, function(_, n){
      return ""+args[ parseInt(n, 10) +1];
    });
    if ($rootScope.messages.length > MAX_MESSAGE) {
      $rootScope.messages.shift();
    }
    $rootScope.messages.push(makeUnique({msg: m}));
    self.addLog(m);
  };

  self.addLog = function(msg) {
    // var scroll = $logsVisibleContents.scrollTop() + $logsVisibleContents.height();
    // var cur = $logsContents.height();
    $rootScope.logs.push(makeUnique({msg: msg}));
    // if (scroll >= cur) {
      // $logsVisibleContents.scrollTop($logsContents.height() - $logsVisibleContents.height());
    // }
  };

  self.addStat = function(id, label, suffix) {
    $rootScope.stats.push({id: id, label: label, suffix: suffix});
  };
  self.updateStat = function(id, value) {
    var stat = $rootScope.stats.filter(function(s){ return s.id == id; })[0];
    if (stat) {
      stat.value = value;
    }
  };

  self.addAction = function(id, name) {
    $rootScope.actions.push({id: id, name: name, action: id});
  };

  var id = 0;
  function makeUnique(obj) {
    obj.id = id++;
    return obj;
  }

}]);
