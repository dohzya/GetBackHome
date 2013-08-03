app.service("GBHDisplay", ["$rootScope", function ($rootScope) {

  "use strict";

  var self = this;

  function formatMessage(msg, args, base) {
    return msg.replace(/\{(\d+)\}/g, function(_, n){
      return ""+args[parseInt(n, 10) + base];
    });
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
  }

  var id = 0;
  function makeUnique(obj) {
    if (!obj.id) { obj.id = id++; }
    return obj;
  }

  // Export
  $.extend(self, {
    addMessage: addMessage
  });

}]);
