app.factory("Groups", ["Survivors", "Memories", "Map", "Logs", "Util", function (Survivors, Memories, Map, Logs, Util) {
  "use strict";

  function Group(args) {
    this.survivors = args.survivors;
    this.memory = Memories.create();
    this.endurance = 0;
    this.messages = this.memory.logs.messages;
  }

  Group.prototype.visitPlace = function (ts, place) {
    var self = this;
    self.memory.addItem(ts, place);
    Map.neighbors(place).map(function (p) {
      self.memory.addItem(ts, p);
    });
  };

  Group.prototype.killSurvivors = function (nb, env) {
    _.forEach(_.range(nb), function () {
      var index = Util.random(this.survivors.length);
      var survivor = this.survivors[index];
      env.addLog(
        "{0} est mort" + (survivor.isMale() ? "" : "e") + " :-(",
        survivor.name
      );
      this.remove(survivor);
    }, this);
  };

  Group.prototype.defense = function () {
    return _.reduce(
      _.map(this.survivors, function (s) {return s.defense(); }),
      function (c, i) { return c + i; }
    );
  };

  Group.prototype.attack = function () {
    return _.reduce(
      _.map(this.survivors, function (s) {return s.attack(); }),
      function (c, i) { return c + i; }
    );
  };

  Group.prototype.tooling = function () {
    return _.reduce(
      _.map(this.survivors, function (s) {return s.tooling(); }),
      function (c, i) { return c + i; }
    );
  };

  Group.prototype.length = function () {
    return this.survivors.length;
  };

  Group.prototype.addLog = function () {
    return this.memory.addLog.apply(this.memory, arguments);
  };

  Group.prototype.add = function (survivors) {
    survivors = _.isArray(survivors) ? survivors : Array.prototype.slice.call(arguments);
    _.forEach(survivors, function (survivor) {
      this.survivors.push(survivor);
    }, this);
  };

  Group.prototype.remove = function (survivor) {
    this.survivors = _.without(this.survivors, survivor);
  };

  Group.prototype.getMaxEndurance = function () {
    // TODO : calculate it from survivors
    return 20;
  };

  Group.prototype.merge = function (group) {
    _.forEach(group.survivors, function (survivor) {
      this.add(survivor);
    }, this);
    this.memory.merge(group.memory);
  };

  Group.prototype.contains = function (survivor) {
    return _.contains(this.survivors, survivor);
  };

  function create(args) {
    if (typeof args === "number") {
      return create({
        survivors: Survivors.createSeveral(args)
      });
    }
    return new Group(args);
  }

  return {
    create: create
  };

}]);
