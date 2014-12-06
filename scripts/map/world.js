import Zone from './zone.js';
import Tile from './tile.js';
import Generator from './generator/generator.js';
import HexJs from '../hexjs/hexjs.js';

const tileAccessor = (zone)=> zone.hexTile;

export default class World {
  constructor (args) {
    args = args || {};
    this.zones = args.zones || Generator.generate("001", 0, 20, 0, 20, (json)=> new Zone(json));
    this.tiles = this.zones.map(function (z) { return new Tile({zone: z}); });

    console.log(this.zones);
    console.log(this.tiles);
  }

  at (x, y) {
    return HexJs.utils.findTile(this.zones, x, y, tileAccessor);
  }

  neighbors (zone) {
    return HexJs.utils.neighbors(this.zones, zone.x, zone.y, tileAccessor);
  }

  hex_round (pos) {
    var x = Math.ceil(pos[0]);
    var y = Math.ceil(pos[1]);
    return at(x, y);
  }

  tileEqual (tile1, tile2) {
    return tile1.x == tile2.x && tile1.y == tile2.y;
  }

  cubeNeighbors (zone) {
    return HexJs.utils.cubeNeighbors(zone.x(), zone.y(), zone.z());
  }

  inNeighborhood (zone1, zone2) {
    var _neighbors = cubeNeighbors(zone1), i;
    for (i = 0; i < _neighbors.length; i++) {
      if (this.tileEqual(_neighbors[i], zone2.tile)) {
        return true;
      }
    }
    return false;
  }
}
