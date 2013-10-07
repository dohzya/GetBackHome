window.app.factory("Logs", [function () {
  "use strict";

  function formatMessage(msg, args) {
    return msg.replace(/\{(\d+)\}/g, function (_, n) {
      var arg = args[parseInt(n, 10)];
      if (typeof arg == "object") { arg = JSON.stringify(arg); }
      return arg.toString();
    });
  }

  var messageId = 0;
  function Message(ts, msg, args) {
    this.id = messageId++;
    this.ts = ts;
    this.msg = msg;
    this.args = args;
  }

  Message.prototype.format = function () {
    return formatMessage(this.msg, this.args);
  };

  Message.create = function (ts, msg, args) {
    return new Message(ts, msg, args);
  };

  function Logs() {
    this.messages = [];
  }

  Logs.prototype.addMessage = function (ts, msg) {
    var args = Array.prototype.splice.call(arguments, 0);
    var message = Message.create(ts, msg, args.slice(2, args.length));
    this.messages.push(message);
    this[message.id] = message;
  };

  Logs.prototype.merge = function (logs) {
    _.forEach(logs.messages, function (msg) {
      this[msg.id] = msg;
    });
  };

  Logs.prototype.clone = function () {
    var log = Logs.create();
    log.messages = _.map(this.messages, function (msg) { return msg; });
    return log;
  };

  Logs.create = function () {
    return new Logs();
  };

  var log = Logs.create();
  log.addMessage(1, "{0} zombies killed by {1} survivors!", 3, 10);
  log.addMessage(2, "{0} zombies killed by {1} survivors!", 3, 10);
  log.addMessage(3, "{0} zombies killed by {1} survivors!", 3, 10);
  console.log(log.messages);
  _.forEach(log.messages, function (msg) {
    console.log(msg);
    console.log(msg.format());
  });

  return {
    create: Message.create,
    formatMessage: formatMessage
  };

}]);
