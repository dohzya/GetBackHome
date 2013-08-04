app.factory("GUIZone", ["$log", "GUISprites", function ($log, Sprites) {
  "use strict";

  var width = 48;
  var height = 48;

  function Zone(zn, opts){
      this.x = zn.x;
      this.y = zn.y;
      this.points = this.buildPoints(0, 0);
      this.infos = zn.infos;
      this.alphaInfection = 1-(this.infos.infection / 100.0);
      this.alphaYouth = 1-(this.infos.youth / 100.0);

      if (this.infos.type1 === "water"){
          this.color = "127, 169, 181";
      }
      else if (this.infos.type1 === "swamp"){
          this.color = "105, 74, 68";
      }
      else if (this.infos.type1 === "plain"){
          this.color = "127, 168, 79";
      }
      else if (this.infos.type1 === "mountainous"){
          this.color = "127, 127, 127";
      }
      else {
          this.color = "0, 0, 0";
      }

      if (this.infos.type2) {
          this.image = Sprites.get(this.infos.type2);
      }
      else {
          this.image = Sprites.get(this.infos.type1);
      }
      if (!this.image) this.image = Sprites.get("grass");
  }

  Zone.prototype.cx = function(){
      return this.x * (3/4 * this.width());
  };

  Zone.prototype.cy = function(){
      return this.y * this.height() - this.x * this.height() / 2;
  };

  Zone.prototype.width = function(){
      return width;
  };
  Zone.prototype.height = function(){
      return height;
  };

  Zone.prototype.buildPoints = function(x, y){
      var cx = this.cx() - x,
          cy = this.cy() - y,
          width = this.width(),
          height = this.height();
      return [
          {x: cx + width/4,   y: cy},
          {x: cx + 3*width/4, y: cy},
          {x: cx + width,     y: cy + height/2},
          {x: cx + 3*width/4, y: cy + height},
          {x: cx + width/4,   y: cy + height},
          {x: cx,             y: cy + height/2},
          {x: cx + width/4,   y: cy}
      ];
  };

  Zone.prototype.drawBackground = function(ctx, x, y){
      var points = this.buildPoints(x, y);
      var color = this.selected ? "255, 250, 71" : this.color;
      ctx.fillStyle = "rgba("+color+", "+this.alphaInfection+")";
      ctx.strokeStyle = "rgba("+color+", "+this.alphaInfection+")";
      ctx.beginPath();
      var point = points[0];
      ctx.moveTo(point[0], point[1]);
      for (var i=1; i<points.length; i++){
          point = points[i];
          ctx.lineTo(point.x, point.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
  };

  Zone.prototype.drawImage = function(ctx, x, y){
      if (this.image) {
          var cx = this.cx() - this.width()/10 - x;
          var cy = this.cy() - this.height()/10 - y;
          var oldGlobalAlpha = ctx.globalAlpha;
          ctx.globalAlpha = this.alphaYouth;
          this.image.draw(ctx, cx, cy, 11/10*this.width(), 11/10*this.height());
          ctx.globalAlpha = oldGlobalAlpha;
      } else {
        $log.error("No img for Zone (" + x + " x " + y + ")");
      }
  };

  Zone.prototype.contains = function(x, y){
      // Stolen from http://local.wasp.uwa.edu.au/~pbourke/geometry/insidepoly/
      for (var i=1; i<this.points.length; i++){
          var p0 = this.points[i];
          var p1 = this.points[ (i+1) % this.points.length ];
          var pos = (y - p0.y)*(p1.x - p0.x) - (x - p0.x)*(p1.y - p0.y);
          if (pos < 0) return false;
      }
      return true;
  };

  Zone.prototype.isContained = function(x, y, dx, dy){
      return x < this.cx() + this.width() &&
             x+dx > this.cx() - this.width() &&
             y < this.cy() + this.height() &&
             y+dy > this.cy() - this.height();
  };

  Zone.prototype.around = function(){
      return [
          Map.interpolateZone(this.cx() + this.width()/2, this.cy() - this.height()/2),
          Map.interpolateZone(this.cx() + this.width(),   this.cy()),
          Map.interpolateZone(this.cx() + this.width()/2, this.cy() + this.height()/2),
          Map.interpolateZone(this.cx() - this.width()/2, this.cy() + this.height()/2),
          Map.interpolateZone(this.cx() - this.width(),   this.cy()),
          Map.interpolateZone(this.cx() - this.width()/2, this.cy() - this.height()/2)
      ];
  };

  Zone.prototype.draw = function(ctx, x, y){
      this.drawBackground(ctx, x, y);
      this.drawImage(ctx, x, y);
  };

  Zone.prototype.onClick = function(e){
  };

  Zone.prototype.onSelected = function(){
      this.selected = true;
  };

  Zone.prototype.display = function(dst){
      dst.displayZone(this);
  };

  Zone.prototype.onUnSelected = function(){
      this.selected = false;
  };

  function create(zn, opts){
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