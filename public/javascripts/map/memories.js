window.app.factory("Memories", ["Places", "Logs", function (Places, Logs) {
  "use strict";

  function placeToKey(place) {
    return place.x() + "x" + place.y();
  }

  function keyToPlace(key) {
    var pos = _.map(key.split("x"), function (n) { return parseInt(n, 10); });
    return Places.at(pos[0], pos[1]);
  }

  function memoryItem(key, ts) {
    var place = keyToPlace(key);
    return ts != null ? place.memoryItem(ts) : null;
  }

  function Memory() {
    this.items = {};
    this.logs = Logs.create();
  }

  Memory.prototype.addItem = function (ts, place) {
    var key = placeToKey(place);
    this.items[key] = ts;
  };

  Memory.prototype.addLog = function () {
    this.logs.addMessage.apply(this.logs, arguments);
  };

  Memory.prototype.item = function (key) {
    var ts = this.items[key];
    return memoryItem(key, ts);
  };

  Memory.prototype.itemForPlace = function (place) {
    return this.item(placeToKey(place));
  };

  Memory.prototype.merge = function (memory, func) {
    var key, newTs, existingTs;
    for (key in memory.items) {
      if (memory.items.hasOwnProperty(key)) {
        newTs = memory.items[key];
        existingTs = this.items[key];
        if (!existingTs || existingTs < newTs) {
          this.items[key] = newTs;
          if (func) { func(memoryItem(key, newTs)); }
        }
      }
    }
    this.logs.merge(memory.logs);
  };

  Memory.prototype.mergeBothWay = function (memory) {
    this.merge(memory);
    memory.merge(this);
  };

  Memory.prototype.forEachItems = function (func) {
    var key, ts, item;
    for (key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        ts = this.items[key];
        item = memoryItem(key, ts);
        func(item);
      }
    }
  }

  Memory.prototype.clone = function () {
    var memory = create();
    var key, item;
    for (key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        memory.items[key] = this.items[key];
      }
    }
    memory.logs = this.logs.clone();
    return memory;
  };

  function create() {
    return new Memory();
  }

  return {
    create: create
  };

}]);
