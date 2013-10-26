window.app.factory("Zones", ["$log", "$rootScope", "Util", "FontAwesome", "Selection", "Sprites", "Places", function ($log, $rootScope, Util, FontAwesome, Selection, Sprites, Places) {
  "use strict";

  var Q = window.Q;
  var Hexjs = window.Hexjs;

  function Zone(place) {
    var type1, type2;

    this.place = place;
    this.status = {};
    this.points = Hexjs.buildPoints(0, 0);

    _.forEach($rootScope.currentPlayer().bases, function (base) {
      if (this.place === base.place) {
        this.status.base = base;
      }
    }, this);

    type1 = this.types()[0];
    type2 = this.types()[1];
    if (type1 === "water") {
      this.color = "127, 169, 181";
    } else if (type1 === "swamp") {
      this.color = "105, 74, 68";
    } else if (type1 === "plain") {
      this.color = "127, 168, 79";
    } else if (type1 === "mountainous") {
      this.color = "127, 127, 127";
    } else {
      this.color = "0, 0, 0";
    }

    if (type2) {
      this.image = Sprites.get(type2);
    } else {
      this.image = Sprites.get(type1);
    }
    if (!this.image) { this.image = Sprites.get("grass"); }
  }

  Zone.prototype.x = function () {
    return this.place.x();
  };

  Zone.prototype.y = function () {
    return this.place.y();
  };

  Zone.prototype.z = function () {
    return this.place.z();
  };

  Zone.prototype.memory = function () {
    return $rootScope.engine.mainGroup.memory.itemForPlace(this.place);
  };

  Zone.prototype.alphaInfection = function (memory) {
    return 1 - (this.infection(memory) / 200.0);
  };
  Zone.prototype.alphaYouth = function (memory) {
    return 1 - (this.youth(memory) / 100.0);
  };

  Zone.prototype.types = function () {
    return this.place.types;
  };

  Zone.prototype.infection = function (memory) {
    return memory.infection();
  };

  Zone.prototype.youth = function (memory) {
    return Math.min(60, $rootScope.engine.turnNb - memory.ts);
  };

  Zone.prototype.updateStatus = function () {
    var mission = Selection.getMission();

    var inPath = mission && mission.anyOrders(function (o) {
      return _.contains(o.path, this.place);
    }, this);

    var order;
    mission && mission.forEachOrders(function (o) {
      if (this.place === o.targetPlace()) {
        order = o;
      }
    }, this);

    this.status = _.extend(this.status, {
      selected: Selection.isInPath(this.place),
      highlighted: this.place.highlighted,
      inPath: inPath,
      orderItem: order
    });
  };

  Zone.prototype.drawBackground = function (ctx, x, y, memory) {
    var points = Hexjs.buildPoints(this.place.tile.center.x - x, this.place.tile.center.y - y, Hexjs.size);
    var style;
    var point, i;
    if (memory) {
      style = "rgba(" + this.color + ", " + this.alphaYouth(memory) + ")";
    } else {
      style = "rgb(238, 238, 207)";
    }
    if (this.status.inPath) { style = "rgba(255, 250, 71, 0.6)"; }
    if (this.status.selected) { style = "rgb(255, 250, 71)"; }
    if (this.status.highlighted) { style = "rgb(0, 0, 255)"; }
    ctx.fillStyle = style;
    ctx.strokeStyle = style;
    ctx.beginPath();
    point = points[0];
    ctx.moveTo(point[0], point[1]);
    for (i = 1; i < points.length; i++) {
      point = points[i];
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(points[0].x, points[0].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  Zone.prototype.drawImage = function (ctx, x, y, memory) {
    if (!memory) {
      // do not display any image
      Util.noop();
    } else if (this.image) {
      var cx = this.place.tile.center.x - x - Hexjs.width / 2;
      var cy = this.place.tile.center.y - y - Hexjs.height / 2;
      var oldGlobalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = this.alphaYouth(memory);
      this.image.draw(ctx, cx, cy, Hexjs.width, Hexjs.height);
      ctx.globalAlpha = oldGlobalAlpha;
    } else {
      $log.error("No img for Zone (" + x + " x " + y + ")");
    }
  };

  Zone.prototype.drawSymbol = function (ctx, x, y) {
    var cx = this.place.tile.center.x - x;
    var cy = this.place.tile.center.y - y;
    ctx.fillStyle = "#FF0000";

    if (this.status.orderItem) {
      ctx.save();
      ctx.font = '20px FontAwesome';
      ctx.fillText(String.fromCharCode(parseInt(FontAwesome.unicode['fa-' + this.status.orderItem.order.icon], 16)), cx - 7, cy + 5);
      ctx.restore();
    }

    if (this.status.base) {
      ctx.fillRect (cx - 5, cy - 5, 11, 11);
    }
  };

  Zone.prototype.drawBorder = function (ctx, x, y) {
    var points = Hexjs.buildPoints(this.place.tile.center.x - x, this.place.tile.center.y - y, Hexjs.size);
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    var point = points[0];
    ctx.moveTo(point[0], point[1]);
    var i;
    for (i = 1; i < points.length; i++) {
      point = points[i];
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(points[0].x, points[0].y);
    ctx.closePath();
    ctx.stroke();
  };

  Zone.prototype.drawCoordinates = function (ctx, x, y) {
    var cx = this.place.tile.center.x - x - Hexjs.width / 2;
    var cy = this.place.tile.center.y - y - Hexjs.height / 2;
    ctx.fillStyle = "#000000";
    ctx.fillText(this.place.tile.x, cx + Hexjs.width - 15, cy + Hexjs.height / 4 + 10);
    ctx.fillText(this.place.tile.y, cx + 10, cy + Hexjs.height / 4 + 10);
    ctx.fillText(this.place.tile.z, cx + Hexjs.width / 2 - 5, cy + Hexjs.height - 10);
  };

  Zone.prototype.draw = function (ctx, x, y) {
    this.updateStatus();
    var memory = this.memory();
    this.drawBackground(ctx, x, y, memory);
    this.drawImage(ctx, x, y, memory);
    this.drawSymbol(ctx, x, y, memory);
    this.drawBorder(ctx, x, y, memory);
    this.drawCoordinates(ctx, x, y, memory);
  };

  Zone.prototype.onClick = Util.noop;

  Zone.prototype.display = function (dst) {
    dst.displayZone(this);
  };

  Zone.prototype.onUnSelected = function () {
    this.selected = false;
  };

  function create(place) {
    return new Zone(place);
  }

  var zones = [];

  Sprites.isLoaded().then(function () {
    zones = _.map(Places.all(), function (place) {
      return create(place);
    });
  });

  function tileAccessor(zone) {
    return zone.place.tile;
  }

  function at(x, y) {
    return Hexjs.find(zones, x, y, tileAccessor);
  }

  function interpolate(px, py) {
    return Hexjs.interpolate(zones, px, py, tileAccessor);
  }

  return {
    create: create,
    all: function () { return zones; },
    at: at,
    interpolate: interpolate,
    isReady: function () { return Q.all([Sprites.isLoaded()]); }
  };

}]);
