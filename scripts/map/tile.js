import HexJs from '../hexjs/hexjs.js';
import Utils from '../utils/utils.js';

export default class Tile {
  constructor (args) {
    args = args || {};
    this.zone = args.zone;
    this.status = {};
  }

  x () {
    return this.zone.x;
  }

  y () {
    return this.zone.y;
  }

  z () {
    return this.zone.z;
  }

  memory () {
    return {};
    // return $rootScope.engine.mainGroup.memory.itemForPlace(this.zone);
  }

  alphaInfection (memory) {
    return 1 - (this.infection(memory) / 200.0);
  }

  alphaYouth (memory) {
    return 1 - (this.youth(memory) / 100.0);
  }

  infection (memory) {
    return memory.infection();
  }

  youth (memory) {
    return Math.min(60, 0); //$rootScope.engine.turnNb - memory.ts);
  }

  updateStatus () {
    var mission = undefined; //Selection.getMission();

    var inPath = mission && mission.anyOrders(function (o) {
      return Utils.contains(o.path, this.zone);
    }, this);

    var order;
    mission && mission.forEachOrders(function (o) {
      if (this.zone === o.targetPlace()) {
        order = o;
      }
    }, this);

    this.status = Utils.extend(this.status, {
      selected: false, //Selection.isInPath(this.zone),
      highlighted: !!this.zone.missions.length,
      inPath: inPath,
      orderItem: order
    });
  }

  drawBackground (ctx, x, y, memory) {
    var points = HexJs.utils.buildPoints(this.zone.hexTile.center.x - x, this.zone.hexTile.center.y - y, HexJs.size());
    var style;
    var point, i;
    if (memory || true) {
      style = 'rgba(' + this.zone.biome.color + ', ' + this.alphaYouth(memory) + ')';
    } else {
      style = 'rgb(238, 238, 207)';
    }
    if (this.status.inPath) { style = 'rgba(255, 250, 71, 0.6)'; }
    if (this.status.selected) { style = 'rgb(255, 250, 71)'; }
    if (this.status.highlighted) { style = 'rgb(0, 0, 255)'; }
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
  }

  drawImage (ctx, x, y, memory) {
    if (!memory) {
      // do not display any image
      Util.noop();
    } else if (this.image) {
      var cx = this.zone.hexTile.center.x - x - HexJs.width / 2;
      var cy = this.zone.hexTile.center.y - y - HexJs.height / 2;
      var oldGlobalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = this.alphaYouth(memory);
      this.image.draw(ctx, cx, cy, HexJs.width, HexJs.height);
      ctx.globalAlpha = oldGlobalAlpha;
    } else {
      $log.error("No img for Zone (" + x + " x " + y + ")");
    }
  }

  drawSymbol (ctx, x, y) {
    var cx = this.zone.hexTile.center.x - x;
    var cy = this.zone.hexTile.center.y - y;
    ctx.fillStyle = "#FF0000";

    if (this.status.orderItem) {
      ctx.save();
      ctx.font = '20px FontAwesome';
      ctx.fillText(String.fromCharCode(parseInt(FontAwesome.unicode['fa-' + this.status.orderItem.order.icon], 16)), cx - 7, cy + 5);
      ctx.restore();
    }

    if (this.status.base) {
      ctx.fillRect(cx - 5, cy - 5, 11, 11);
    }
  }

  drawBorder (ctx, x, y) {
    var points = HexJs.utils.buildPoints(this.zone.hexTile.center.x - x, this.zone.hexTile.center.y - y, HexJs.size());
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
  }

  drawCoordinates (ctx, x, y) {
    var cx = this.zone.hexTile.center.x - x - HexJs.config.width / 2;
    var cy = this.zone.hexTile.center.y - y - HexJs.config.height / 2;
    ctx.fillStyle = "#000000";
    ctx.fillText(this.zone.x, cx + HexJs.config.width - 15, cy + HexJs.config.height / 4 + 10);
    ctx.fillText(this.zone.y, cx + 10, cy + HexJs.config.height / 4 + 10);
    ctx.fillText(this.zone.z, cx + HexJs.config.width / 2 - 5, cy + HexJs.config.height - 10);
  }

  draw (ctx, x, y) {
    this.updateStatus();
    var memory = this.memory();
    this.drawBackground(ctx, x, y, memory);
    // this.drawImage(ctx, x, y, memory);
    // this.drawSymbol(ctx, x, y, memory);
    this.drawBorder(ctx, x, y, memory);
    this.drawCoordinates(ctx, x, y, memory);
  }

  display (dst) {
    dst.displayZone(this);
  }

  onUnSelected () {
    this.selected = false;
  }
}
