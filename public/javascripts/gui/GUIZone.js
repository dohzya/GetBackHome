app.factory("GUIZone", ["$log", "GUISprites", function ($log, Sprites) {
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

  Zone.prototype.alphaInfection = function () {
    return 1 - (this.infection() / 200.0);
  };
  Zone.prototype.alphaYouth = function () {
    return 1 - (this.youth() / 100.0);
  };

  Zone.prototype.types = function () {
    return this.place.types;
  };

  Zone.prototype.infection = function () {
    return this.place.infection();
  };

  Zone.prototype.youth = function () {
    return this.place.youth;
  };


  Zone.prototype.cx = function () {
    return (this.x() * width) - (this.y() * width / 2) + (width / 2);
  };

  Zone.prototype.cy = function () {
    return (this.y() * 3 / 4 * height) + (height / 2);
  };

  Zone.prototype.buildPoints = function (x, y) {
    var cx = this.cx() - x;
    var cy = this.cy() - y;
    return [
      {x: cx - width / 2,     y: cy - height / 4},
      {x: cx - width / 2,     y: cy + height / 4},
      {x: cx,                 y: cy + height / 2},
      {x: cx + width / 2,     y: cy + height / 4},
      {x: cx + width / 2,     y: cy - height / 4},
      {x: cx,                 y: cy - height / 2},
      {x: cx - width / 2,     y: cy - height / 4}
    ];
  };

  Zone.prototype.drawBackground = function (ctx, x, y) {
    var points = this.buildPoints(x, y);
    var color = this.selected ? "255, 250, 71" : this.color;
    ctx.fillStyle = "rgba(" + color + ", " + this.alphaInfection() + ")";
    ctx.strokeStyle = "rgba(" + color + ", " + this.alphaInfection() + ")";
    ctx.beginPath();
    var point = points[0];
    ctx.moveTo(point[0], point[1]);
    var i;
    for (i = 1; i < points.length; i++) {
      point = points[i];
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  Zone.prototype.drawImage = function (ctx, x, y) {
    if (this.image) {
      var cx = this.cx() - width / 2 - width / 10 - x;
      var cy = this.cy() - height / 2 - height / 10 - y;
      var oldGlobalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = this.alphaYouth();
      this.image.draw(ctx, cx, cy, 11 / 10 * width, 11 / 10 * height);
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
    return x < this.cx() + width / 2 &&
         x + dx > this.cx() - width / 2 &&
         y < this.cy() + height / 2 &&
         y + dy > this.cy() - height / 2;
  };

  Zone.prototype.around = function () {
    return [
      Map.interpolateZone(this.cx() + width / 2, this.cy() - height / 2),
      Map.interpolateZone(this.cx() + width,   this.cy()),
      Map.interpolateZone(this.cx() + width / 2, this.cy() + height / 2),
      Map.interpolateZone(this.cx() - width / 2, this.cy() + height / 2),
      Map.interpolateZone(this.cx() - width,   this.cy()),
      Map.interpolateZone(this.cx() - width / 2, this.cy() - height / 2)
    ];
  };

  Zone.prototype.draw = function (ctx, x, y) {
    this.drawBackground(ctx, x, y);
    this.drawImage(ctx, x, y);
  };

  Zone.prototype.onClick = function () {
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
