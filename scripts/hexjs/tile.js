'use strict';

import Utils from './utils.js';
import Config from './config.js';

export default class Tile {
  // Definition of an hexagonal tile
  constructor (coordsX, coordsY, coordsZ) {
    // Cube coordinates
    coordsZ = Utils.checkZ(coordsX, coordsY, coordsZ);
    this.x = coordsX;
    this.y = coordsY;
    this.z = coordsZ;

    // Axial coordinates
    var a = Utils.cubeToAxial(this.x, this.y, this.z);
    this.q = a.q;
    this.r = a.r;
    this.checkSize();
  }

  checkSize () {
    if (this.size !== Config.size()) {
      this.updateSize();
    }
  }

  updateSize () {
    this.size = Config.size();
    this.center = this.toPixel();
  }

  distanceTo (tile) {
    return Utils.distance(this, tile);
  }

  toPixel () {
    return Utils.tileToPixel(this, Config.size());
  }

  center () {
    this.checkSize();
    return this.center;
  }

  cubeNeighbors () {
    return Utils.cubeNeighbors(this.x, this.y, this.z);
  }

  neighbors (at) {
    return Utils.neighbors(at, this.x, this.y, this.z);
  }

  axialNeighbors () {
    return Utils.axialNeighbors(this.q, this.r);
  }

  isContained (x, y, dx, dy) {
    this.checkSize();
    return x < (this.center.x + Config.width) &&
      x + dx > (this.center.x - Config.width) &&
      y < (this.center.y + Config.height) &&
      y + dy > (this.center.y - Config.height);
  }
}
