window.app.factory("Memory", ["Map", function (Map) {
  "use strict";

  function placeToKey(place) {
    return place.pos[0] + "x" + place.pos[1];
  }

  function keyToPlace(key) {
    var pos = _.map(key.split("x"), function (n) { return parseInt(n); });
    return Map.getPlace(pos[0], pos[1]);
  }

  function memoryItem(key, ts) {
    var place = keyToPlace(key);
    return ts != null ? place.memoryItem(ts) : null;
  }

  function Memory() {
    this.items = {};
  }

  Memory.prototype.addItem = function (ts, place) {
    var key = placeToKey(place);
    this.items[key] = ts;
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
  };

  Memory.prototype.mergeBothWay = function (memory) {
    this.merge(memory);
    memory.merge(this);
  };

  Memory.prototype.forEach = function (func) {
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
        memory[key] = this.items[key];
      }
    }
    return memory;
  };

  function create() {
    return new Memory();
  }

  return {
    create: create
  };

}]);
