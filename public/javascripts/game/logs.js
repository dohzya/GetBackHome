window.app.factory("Logs", ["$rootScope", function ($rootScope) {
  "use strict";

  function formatMessage(msg, args) {
    return msg.replace(/\{(\d+)\}/g, function (_, n) {
      var arg = args[parseInt(n, 10)];
      if (arg == undefined) {
        arg = "";
      } else if (typeof arg == "object") {
        arg = JSON.stringify(arg);
      } else if (typeof arg == "number") {
        arg = parseInt(arg * 100, 10) / 100;
      }
      return arg.toString();
    });
  }

  var messageId = 0;
  function Message(msg, args) {
    this.id = messageId++;
    this.ts = $rootScope.engine.turnNb;
    this.msg = msg;
    this.args = args;
  }

  Message.prototype.format = function () {
    return formatMessage(this.msg, this.args);
  };

  Message.create = function (msg, args) {
    return new Message(msg, args);
  };

  function Logs() {
    this.messages = [];
  }

  Logs.prototype.addMessage = function (msg) {
    var args = Array.prototype.splice.call(arguments, 0);
    var message = Message.create(msg, args.slice(1, args.length));
    this.messages.push(message);
    if (window.DEBUG_GBH) {
      console.log(message.ts + " :: " + message.format());
    }
    this[message.id] = message;
  };

  Logs.prototype.merge = function (logs) {
    _.forEach(logs.messages, function (message) {
      this.messages.push(message);
      this[message.id] = message;
    }, this);
  };

  Logs.prototype.clone = function () {
    var log = Logs.create();
    log.messages = _.map(this.messages, function (msg) { return msg; });
    return log;
  };

  Logs.create = function () {
    return new Logs();
  };

  return {
    create: Logs.create
  };

}]);
