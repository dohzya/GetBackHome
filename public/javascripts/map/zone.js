window.app.factory("Zone", ["$log", "$rootScope", "Util", "Sprite", function ($log, $rootScope, Util, Sprites) {
  "use strict";

  var Hexjs = window.Hexjs;

  function Zone(place) {
    var type1, type2;

    this.place = place;
    this.points = Hexjs.buildPoints(0, 0);

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
    return $rootScope.engine.turnNb - memory.ts;
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
    if (this.isInPath()) { style = "rgba(255, 250, 71, 0.6)"; }
    if (this.isSelected()) { style = "rgb(255, 250, 71)"; }
    if (this.isHighlighted()) { style = "rgb(0, 0, 255)"; }
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
    
    if (this.isWithOrder()) {
      ctx.beginPath();
      ctx.arc(this.place.tile.center.x - x, this.place.tile.center.y - y, 8, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fillStyle = "#FF0000";
      ctx.fill();
    }
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
    var memory = this.memory();
    this.drawBackground(ctx, x, y, memory);
    this.drawImage(ctx, x, y, memory);
    this.drawBorder(ctx, x, y, memory);
    this.drawCoordinates(ctx, x, y, memory);
  };

  Zone.prototype.onClick = Util.noop;

  Zone.prototype.isSelected = function () {
    return this.place.selected || this.selected;
  };

  Zone.prototype.isHighlighted = function () {
    return this.place.highlighted || this.highlighted;
  };

  Zone.prototype.isInPath = function () {
    return this.place.inPath || this.inPath;
  };

  Zone.prototype.isWithOrder = function () {
    return this.place.hasOrder || this.hasOrder;
  };

  Zone.prototype.onSelected = function () {
    this.selected = true;
  };

  Zone.prototype.display = function (dst) {
    dst.displayZone(this);
  };

  Zone.prototype.onUnSelected = function () {
    this.selected = false;
  };

  function create(zn, opts) {
    return new Zone(zn, opts);
  }

  return {
    create: create
  };

}]);
