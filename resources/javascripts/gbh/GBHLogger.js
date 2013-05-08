app.service("GBHLogger", [function () {
  "use strict";

  var self = this;

  var TRACE = 1;
  var DEBUG = 2;
  var INFO = 3;
  var WARN = 4;
  var ERROR = 5;
  var LEVELS = {
    trace: TRACE,
    debug: DEBUG,
    info: INFO,
    warn: WARN,
    error: ERROR
  }

  var LEVEL = TRACE
  function setLevel(value) {
    if (typeof(value) == "number") { LEVEL = value; }
    else { LEVEL = LEVEL[value]; }
  }

  function trace(msg) {
    if (console && LEVEL <= TRACE) { console.log("TRACE: "+ formatMessage(msg, arguments, 1)); }
  }

  function debug(msg) {
    if (console && LEVEL <= DEBUG) { console.log("DEBUG: "+ formatMessage(msg, arguments, 1)); }
  }
  function info(msg) {
    if (console && LEVEL <= INFO) { console.log("INFO: "+ formatMessage(msg, arguments, 1)); }
  }
  function warn(msg) {
    if (console && LEVEL <= WARN) { console.log("WARN: "+ formatMessage(msg, arguments, 1)); }
  }
  function error(msg) {
    if (console && LEVEL <= ERROR) { console.log("ERROR: "+ formatMessage(msg, arguments, 1)); }
  }

  // Helpers

  function formatMessage(msg, args, base) {
    return msg.replace(/\{(\d+)\}/g, function(_, n){
      var arg = args[parseInt(n, 10) + base];
      if (typeof(arg) == "object") { arg = JSON.stringify(arg); }
      return ""+arg;
    });
  }

  // Export

  $.extend(self, {
    trace: trace,
    debug: debug,
    info: info,
    warn: warn,
    error: error
  });

}]);
