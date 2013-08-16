app.factory("GUIZone", ["$log", "$rootScope", "GUISprites", function ($log, $rootScope, Sprites) {
  "use strict";

  var width = 48;
  var height = 48;

  function Zone(place) {
    var type1, type2;

    this.place = place;
    this.points = this.buildPoints(0, 0);

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
    return this.place.pos[0];
  };

  Zone.prototype.y = function () {
    return this.place.pos[1];
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


  Zone.prototype.cx = function () {
    return this.x() * (3 / 4 * this.width());
  };

  Zone.prototype.cy = function () {
    return this.y() * this.height() - this.x() * this.height() / 2;
  };

  Zone.prototype.width = function () {
    return width;
  };
  Zone.prototype.height = function () {
    return height;
  };

  Zone.prototype.buildPoints = function (x, y) {
    var cx = this.cx() - x,
      cy = this.cy() - y;
    return [
      {x: cx + width / 4,   y: cy},
      {x: cx + 3 * width / 4, y: cy},
      {x: cx + width,     y: cy + height / 2},
      {x: cx + 3 * width / 4, y: cy + height},
      {x: cx + width / 4,   y: cy + height},
      {x: cx,         y: cy + height / 2},
      {x: cx + width / 4,   y: cy}
    ];
  };

  Zone.prototype.drawBackground = function (ctx, x, y, memory) {
    var points = this.buildPoints(x, y);
    var style;
    var point, i;
    if (memory) {
      style = "rgba(" + this.color + ", " + this.alphaInfection(memory) + ")";
    } else {
      style = "rgb(0, 0, 0)";
    }
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
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  Zone.prototype.drawImage = function (ctx, x, y, memory) {
    if (!memory) {
      // do not display any image
    } else if (this.image) {
      var cx = this.cx() - this.width() / 10 - x;
      var cy = this.cy() - this.height() / 10 - y;
      var oldGlobalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = this.alphaYouth(memory);
      this.image.draw(ctx, cx, cy, 11 / 10 * this.width(), 11 / 10 * this.height());
      ctx.globalAlpha = oldGlobalAlpha;
      var point = this.buildPoints(x, y)[0];
      ctx.fillStyle = "#000000";
      ctx.fillText(this.x() + "x" + this.y(), point.x, point.y + 15);
    } else {
      $log.error("No img for Zone (" + x + " x " + y + ")");
    }
  };

  Zone.prototype.contains = function (x, y) {
    // Stolen from http://local.wasp.uwa.edu.au/~pbourke/geometry/insidepoly/
    var i, p0, p1, pos;
    for (i = 1; i < this.points.length; i++) {
      p0 = this.points[i];
      p1 = this.points[(i + 1) % this.points.length];
      pos = (y - p0.y) * (p1.x - p0.x) - (x - p0.x) * (p1.y - p0.y);
      if (pos < 0) { return false; }
    }
    return true;
  };

  Zone.prototype.isContained = function (x, y, dx, dy) {
    return x < this.cx() + this.width() &&
         x + dx > this.cx() - this.width() &&
         y < this.cy() + this.height() &&
         y + dy > this.cy() - this.height();
  };

  Zone.prototype.around = function () {
    return [
      Map.interpolateZone(this.cx() + this.width() / 2, this.cy() - this.height() / 2),
      Map.interpolateZone(this.cx() + this.width(),   this.cy()),
      Map.interpolateZone(this.cx() + this.width() / 2, this.cy() + this.height() / 2),
      Map.interpolateZone(this.cx() - this.width() / 2, this.cy() + this.height() / 2),
      Map.interpolateZone(this.cx() - this.width(),   this.cy()),
      Map.interpolateZone(this.cx() - this.width() / 2, this.cy() - this.height() / 2)
    ];
  };

  Zone.prototype.draw = function (ctx, x, y) {
    var memory = this.memory();
    this.drawBackground(ctx, x, y, memory);
    this.drawImage(ctx, x, y, memory);
  };

  Zone.prototype.onClick = function () {
  };

  Zone.prototype.isSelected = function () {
    return this.place.selected || this.selected;
  };

  Zone.prototype.isHighlighted = function () {
    return this.place.highlighted || this.highlighted;
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

  function getSize() {
    return {
      width: width,
      height: height
    };
  }

  function getWidth() {
    return width;
  }

  function getHeight() {
    return height;
  }

  function setSize(w, h) {
    width = w;
    height = h;
  }

  return {
    create: create,
    getSize: getSize,
    setSize: setSize,
    getWidth: getWidth,
    getHeight: getHeight
  };

}]);
