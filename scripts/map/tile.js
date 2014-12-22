import HexJs from '../hexjs/hexjs.js';
import HexTile from '../hexjs/tile.js';
import Utils from '../utils/utils.js';
import Config from '../utils/config.js';

const defaultStatus = {
  selected: false,
  inPath: false
};

export default class Tile extends HexTile {
  constructor (args) {
    args = args || {};
    this.zone = args.zone;
    this.world = args.world;
    this.zone.tile = this;
    this.status = defaultStatus;

    super(this.zone.x, this.zone.y, this.zone.z || 0);
  }

  distanceTo (tile) {
    return HexJs.utils.distance(this, tile);
  }

  costTo () {
    return 10;
  }

  neighbors () {
    return this.world.neighbors(this);
  }

  pathTo (destination) {
    return HexJs.findWith.astar(this, destination, Config.hexjs);
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

  updateStatus (selection) {
    if (!selection) {
      this.status = defaultStatus;
    } else {
      this.status = {
        selected: selection.tile === this,
        inPath: selection.path.indexOf(this) >= 0,
        order: null
      };
    }
  }

  drawBackground (ctx, x, y, memory) {
    var points = HexJs.utils.buildPoints(this.center.x - x, this.center.y - y, HexJs.size());
    var style;
    var point, i;
    if (memory || true) {
      style = 'rgba(' + this.zone.biome.color + ', ' + this.alphaYouth(memory) + ')';
    } else {
      style = 'rgb(238, 238, 207)';
    }
    if (this.status.inPath) { style = 'rgba(243, 156, 18, 0.5)'; }
    if (this.status.selected) { style = 'rgb(192, 57, 43)'; }
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

    // if (this.status.inPath || this.status.selected) {
    //   // Reset original background color
    //   ctx.fillStyle = 'rgb(0,0,0)';
    //   ctx.strokeStyle = 'rgb(0,0,0)';
    //   ctx.stroke();
    //   ctx.fill();
    //   ctx.fillStyle = style;
    //   ctx.strokeStyle = style;
    // }

    ctx.stroke();
    ctx.fill();
  }

  drawImage (ctx, x, y, memory) {
    if (!memory) {
      // do not display any image
      Util.noop();
    } else if (this.image) {
      var cx = this.center.x - x - HexJs.config.width / 2;
      var cy = this.center.y - y - HexJs.config.height / 2;
      var oldGlobalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = this.alphaYouth(memory);
      this.image.draw(ctx, cx, cy, HexJs.config.width, HexJs.config.height);
      ctx.globalAlpha = oldGlobalAlpha;
    }
  }

  drawStructure (ctx, x, y, memory) {
    if (memory && this.zone.structure) {
      var cx = this.center.x - x;
      var cy = this.center.y - y;
      ctx.fillStyle = 'rgba('+this.zone.structure.color+', 0.7)';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI*2,true);
      ctx.fill();
    }
  }

  drawSymbol (ctx, x, y) {
    var cx = this.center.x - x;
    var cy = this.center.y - y;
    ctx.fillStyle = '#FF0000';

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
    var points = HexJs.utils.buildPoints(this.center.x - x, this.center.y - y, HexJs.size());
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
    var cx = this.center.x - x - HexJs.config.width / 2;
    var cy = this.center.y - y - HexJs.config.height / 2;
    ctx.fillStyle = "#000000";
    ctx.fillText(this.zone.x, cx + 10, cy + HexJs.config.height / 4 + 10);
    ctx.fillText(this.zone.y, cx + HexJs.config.width - 15, cy + HexJs.config.height / 4 + 10);
    ctx.fillText(this.zone.z, cx + HexJs.config.width / 2 - 5, cy + HexJs.config.height - 10);
  }

  draw (ctx, x, y, selection) {
    this.updateStatus(selection);
    var memory = this.memory();
    this.drawBackground(ctx, x, y, memory);
    // this.drawImage(ctx, x, y, memory);
    this.drawStructure(ctx, x, y, memory);
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
