import Zone from './zone.js';
import Tile from './tile.js';
import Generator from './generator/generator.js';
import HexJs from '../hexjs/hexjs.js';

export default class World {
  constructor (args) {
    args = args || {};
    this.zones = args.zones || Generator.generate("001", 0, 20, 0, 20, (json)=> new Zone(json));
    this.tiles = this.zones.map(function (z) { return new Tile({zone: z}); });

    console.log(this.zones);
    console.log(this.tiles);
  }

  at (x, y) {
    return HexJs.utils.findTile(this.tiles, x, y);
  }

  neighbors (tile) {
    return HexJs.utils.neighbors(this.tiles, zone.x, zone.y);
  }

  hex_round (pos) {
    const x = Math.ceil(pos[0]);
    const y = Math.ceil(pos[1]);
    return at(x, y);
  }

  tileEqual (tile1, tile2) {
    return tile1.x === tile2.x && tile1.y === tile2.y && tile1.z === tile2.z;
  }

  cubeNeighbors (tile) {
    return HexJs.utils.cubeNeighbors(tile.x, tile.y, tile.z);
  }

  inNeighborhood (tile1, tile2) {
    const _neighbors = cubeNeighbors(tile1);
    let i;
    for (i = 0; i < _neighbors.length; i++) {
      if (this.tileEqual(_neighbors[i], tile2)) {
        return true;
      }
    }
    return false;
  }

  interpolate(px, py) {
    return HexJs.utils.interpolate(this.tiles, px, py);
  }
}
