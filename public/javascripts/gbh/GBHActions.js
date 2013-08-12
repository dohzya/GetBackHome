app.service("GBHActions", ["$rootScope", "GBHLogger", "GBHModels", function ($rootScope, Logger, Models) {
  "use strict";

  var self = this;

  function Stat(args) {
    this.id = args.id;
    this.label = args.label;
    this.value = args.value;
  }
  function createStat(args) {
    return new Stat(args);
  }

  var actions = {};

  function Action(args) {
    this.id = args.id;
    this.name = args.name;
    if (typeof(args.order) === "string") {
      //this.order = Models.order(args.order);
    }
    else {
      this.order = args.order;
    }
    this.stats = args.stats;
  }
  function createAction(args) {
    var action = new Action(args);
    actions[action.id] = action;
    //$rootScope.buttons.push(action);
    return action;
  }

  function action(id) {
    return actions[id];
  }

  // Export
  $.extend(self, {
    createStat: createStat,
    createAction: createAction,
    action: action
  });

}]);
