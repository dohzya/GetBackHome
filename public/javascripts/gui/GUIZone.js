app.factory("GUIZone", ["$log", "GUISprites", function ($log, Sprites) {
  "use strict";

  function Zone(place) {
    var type1, type2;

    this.place = place;
    this.tile = new Tile(this.place.pos[0], this.place.pos[1]);
    this.points = buildPoints(0, 0);

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
    return this.tile.x;
  };

  Zone.prototype.y = function () {
    return this.tile.y;
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

  Zone.prototype.drawBackground = function (ctx, x, y) {
    var points = buildPoints(this.tile.centerX - x, this.tile.centerY - y, size);
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
    ctx.lineTo(points[0].x, points[0].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  Zone.prototype.drawImage = function (ctx, x, y) {
    if (this.image) {
      var cx = this.tile.centerX - x - Hexjs.width / 2;
      var cy = this.tile.centerY - y - Hexjs.height / 2;
      var oldGlobalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = this.alphaYouth();
      this.image.draw(ctx, cx, cy, Hexjs.width, Hexjs.height);
      ctx.globalAlpha = oldGlobalAlpha;
      ctx.fillStyle = "#000000";
      ctx.fillText(this.tile.x, cx + Hexjs.width - 15, cy + Hexjs.height / 4 + 10);
      ctx.fillText(this.tile.y, cx + 10, cy + Hexjs.height / 4 + 10);
      ctx.fillText(this.tile.z, cx + Hexjs.width / 2 - 5, cy + Hexjs.height - 10);
    } else {
      $log.error("No img for Zone (" + x + " x " + y + ")");
    }
  };

  Zone.prototype.drawBorder = function (ctx, x, y) {
    var points = buildPoints(this.tile.centerX - x, this.tile.centerY - y, size);
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

  Zone.prototype.draw = function (ctx, x, y) {
    this.drawBackground(ctx, x, y);
    this.drawImage(ctx, x, y);
    this.drawBorder(ctx, x, y);
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

  return {
    create: create
  };

}]);
