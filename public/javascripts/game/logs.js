window.app.factory("Logs", [function () {
  "use strict";

  function _formatMessage(msg, args) {
    return msg.replace(/\{(\d+)\}/g, function (_, n) {
      var arg = args[parseInt(n, 10)];
      if (typeof arg == "object") { arg = JSON.stringify(arg); }
      return arg.toString();
    });
  }

  function Log() {
    this.messages = [];
  }

  function create() {
    return new Log();
  }

  Log.prototype.addMessage = function (ts, msg) {
    var args = Array.prototype.splice.call(arguments, 0);
    var message = {ts: ts, msg: msg, params: args.slice(2, args.length)};
    this.messages.push(message);
  };

  Log.prototype.clone = function () {
    var log = create();
    log.messages = _.map(this.messages, function (msg) { return msg; });
    return log;
  };

  function formatMessage(msg) {
    return _formatMessage(msg.msg, msg.params);
  }

  var log = create();
  log.addMessage(1, "{0} zombies killed by {1} survivors!", 3, 10);
  log.addMessage(2, "{0} zombies killed by {1} survivors!", 3, 10);
  log.addMessage(3, "{0} zombies killed by {1} survivors!", 3, 10);
  console.log(log.messages);
  _.forEach(log.messages, function (msg) {
    console.log(formatMessage(msg));
  });

  return {
    create: create,
    formatMessage: formatMessage
  };

}]);
