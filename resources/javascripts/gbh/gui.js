window.GBH.gui = (function($, GBH){
  "use strict";

  var self = {
    MAX_MESSAGE: 5
  };

  var $messagesFrame, $actionsFrame, $statsFrame, $logsFrame;

  function init(){
    $messagesFrame = $("#ghb-frame-messages .gbh-contents"),
    $actionsFrame = $("#ghb-frame-actions .gbh-contents"),
    $statsFrame = $("#ghb-frame-stats .gbh-contents"),
    $logsFrame = $("#ghb-frame-logs .gbh-contents");
  }

  var messagesNb = 0;
  function addMessage(msg) {
    if (messagesNb < self.MAX_MESSAGE) messagesNb++;
    else $messagesFrame.find(".gbh-content:first-child").remove();
    showMessage(msg);
    showLog(msg);
  }

  function clearMessages() {
    $messagesFrame.html("");
  }
  function showMessage(msg) {
    var content = "<div class=\"gbh-content\">"+msg+"</div>";
    $messagesFrame.append(content);
  }
  function showLog(msg) {
    var content = "<div class=\"gbh-content\">"+msg+"</div>";
    $logsFrame.append(content);

  }


  function addStat(id, label, suffix) {
    var s = suffix ? "data-suffix=\""+ suffix +"\"" : ""
    var content = "<div id=\"gbh-stats-"+ id +"\" class=\"gbh-content\">" +
                    "<div class=\"gbh-content-label\">"+ label +" :</div>" +
                    "<div class=\"gbh-content-value\" "+ s +"></div>" +
                  "</div>";
    $statsFrame.append(content);
  }
  function updateStat(id, value) {
    var $elem = $("#gbh-stats-"+id+" .gbh-content-value");
    var suffix = $elem.data("suffix") || "";
    $elem.html("" + value + suffix);
  }

  function addAction(id, name, cb) {
    var content = "<button id=\"gbh-action-"+ id +"\" class=\"btn gbh-content\">"+name+"</button>";
    $actionsFrame.append(content);
    $actionsFrame.on("click", "#gbh-action-"+id, function(e){ cb(e); });
  }


  $.extend(self, {
    init: init,
    addMessage: addMessage,
    addAction: addAction,
    addStat: addStat,
    updateStat: updateStat
  });

  return self;
})(jQuery, GBH);
