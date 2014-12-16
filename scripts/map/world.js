import Zone from './zone.js';
import Tile from './tile.js';
import Generator from './generator/generator.js';
import HexJs from '../hexjs/hexjs.js';

class World {
  constructor (args) {
    args = args || {};
    this.zonesIndex = [];
    this.zones = args.zones || Generator.generate("001", 0, 20, 0, 20, (json)=> new Zone(json));
    this.zones.forEach(function (zone) {
      if (!this.zonesIndex[zone.x]) {
        this.zonesIndex[zone.x] = [];
      }
      this.zonesIndex[zone.x][zone.y] = zone;
    }.bind(this));

    this.tilesIndex = [];
    this.tiles = this.zones.map(function (zone) {
      if (!this.tilesIndex[zone.x]) {
        this.tilesIndex[zone.x] = [];
      }
      this.tilesIndex[zone.x][zone.y] = new Tile({zone, world: this});

      return this.tilesIndex[zone.x][zone.y];
    }.bind(this));
  }

  tileAt (x, y) {
    if (!this.tilesIndex[x]) {
      this.tilesIndex[x] = [];
    }

    if (this.tilesIndex[x][y] === undefined) {
      const zone = this.zoneAt(x, y);
      this.tilesIndex[x][y] = zone ? new Tile({zone, world: this}) : null;
    }

    return this.tilesIndex[x][y];
  }

  zoneAt (x, y) {
    return this.zonesIndex[x] && this.zonesIndex[x][y];
  }

  neighbors (tile) {
    return HexJs.utils.neighbors(this.tileAt.bind(this), tile.x, tile.y);
  }

  hex_round (pos) {
    const x = Math.ceil(pos[0]);
    const y = Math.ceil(pos[1]);
    return this.tileAt(x, y);
  }

  tileEqual (tile1, tile2) {
    return tile1.x === tile2.x && tile1.y === tile2.y && tile1.z === tile2.z;
  }

  cubeNeighbors (tile) {
    return HexJs.utils.cubeNeighbors(tile.x, tile.y, tile.z);
  }

  inNeighborhood (tile1, tile2) {
    return this.cubeNeighbors(tile1).reduce(function (result, neighbor) {
      return result || this.tileEqual(neighbor, tile2);
    }, false);
  }

  interpolate(px, py) {
    return HexJs.utils.interpolate(this.tileAt.bind(this), px, py);
  }
}

const world = new World();

export default world;
