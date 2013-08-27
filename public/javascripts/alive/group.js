app.factory("Group", ["Survivor", "Memory", "Map", function (Survivor, Memory, Map) {
  "use strict";

  function Group(args) {
    this.survivors = args.survivors;
    this.memory = Memory.create();
  }

  Group.prototype.visitPlace = function (ts, place) {
    var self = this;
    self.memory.addItem(ts, place);
    Map.neighbors(place).map(function (p) {
      self.memory.addItem(ts, p);
    });
  };

  Group.prototype.killSurvivors = function (nb) {
    var survivors = [], i;
    for (i = 0; i < this.survivors.length - nb; i++) {
      survivors.push(this.survivors[i]);
    }
    this.survivors = survivors;
  };

  Group.prototype.defense = function () {
    var defense = 0, i, survivor;
    for (i in this.survivors) {
      survivor = this.survivors[i];
      defense += survivor.defense();
    }
    return defense;
  };

  Group.prototype.attack = function () {
    var attack = 0, i, survivor;
    for (i in this.survivors) {
      survivor = this.survivors[i];
      attack += survivor.attack();
    }
    return attack;
  };

  Group.prototype.tooling = function () {
    var attack = 0, i, survivor;
    for (i in this.survivors) {
      survivor = this.survivors[i];
      attack += survivor.tooling;
    }
    return attack;
  };

  Group.prototype.length = function () {
    return this.survivors.length;
  };

  Group.prototype.addSurvivors = function (nb) {
    var newSurvivors = Survivor.createSeveral(nb), i;
    for (i in newSurvivors) {
      this.survivors.push(newSurvivors[i]);
    }
  };

  Group.prototype.removeSurvivors = function (nb) {
    var i;
    for (i = 0; i < nb; i++) {
      this.survivors.pop();
    }
  };

  function create(args) {
    if (typeof args === "number") {
      return create({
        survivors: Survivor.createSeveral(args)
      });
    }
    return new Group(args);
  }

  return {
    create: create
  };

}]);
