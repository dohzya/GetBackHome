import Config from './config.js';
import Tile from './tile.js';
import Utils from './utils.js';
import FindMe from './findme.js';

export default {
  utils: Utils,
  config: Config,
  findWith: {
    astar: FindMe.astar
  },
  size: (s)=> {
    return Config.size(s);
  },
  tile: (x, y, z)=> {
    return new Tile(x, y, z);
  }
}
