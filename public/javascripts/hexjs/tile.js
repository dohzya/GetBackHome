(function (window) {
  "use strict";

  // Rely on a library like Lo-Dash or Underscore
  // but here is a small fallback if missing
  var _ = window._ || {
    isFunction: function (value) {
      return typeof value === "function";
    },
    identity: function (value) {
      return value;
    },
    find: function (array, callback) {
      array.forEach(function (elem) {
        if (callback(elem)) {
          return elem;
        }
      });
    },
    map: function (array, callback) {
      var result = [];
      array.forEach(function (elem) {
        result.push(callback(elem));
      });
      return result;
    }
  };

  // Generic functions
  function checkZ(x, y, z) {
    if (z === null || z === undefined) {
      z = -(x + y);
    }
    return z;
  }

  function axialToCube(q, r) {
    return {
      x: r,
      y: q,
      z: -(r + q)
    };
  }

  function cubeToAxial(x, y) {
    return {
      q: y,
      r: x
    };
  }

  function distance(tile1, tile2) {
    return Math.max(Math.abs(tile1.x - tile2.x), Math.abs(tile1.y - tile2.y), Math.abs(tile1.z - tile2.z));
  }

  function cubeNeighbors(x, y, z) {
    z = checkZ(x, y, z);

    return [
      {x: x + 1, y: y - 1, z: z    },
      {x: x + 1, y: y,     z: z - 1},
      {x: x,     y: y + 1, z: z - 1},
      {x: x - 1, y: y + 1, z: z    },
      {x: x - 1, y: y,     z: z + 1},
      {x: x,     y: y - 1, z: z + 1}
    ];
  }

  function axialNeighbors(q, r) {
    return [
      {q: q + 1, r: r    },
      {q: q + 1, r: r - 1},
      {q: q,     r: r - 1},
      {q: q - 1, r: r    },
      {q: q - 1, r: r + 1},
      {q: q,     r: r + 1}
    ];
  }

  function roundCube(x, y, z) {
    z = checkZ(x, y, z);

    var rx = Math.round(x);
    var ry = Math.round(y);
    var rz = Math.round(z);

    var xErr = Math.abs(rx - x);
    var yErr = Math.abs(ry - y);
    var zErr = Math.abs(rz - z);

    if (xErr > yErr && xErr > zErr) {
      rx = -ry - rz;
    } else if (yErr > zErr) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }

    return {
      x: rx,
      y: ry,
      z: rz
    };
  }

  function tileToPixel(tile) {
    return {
      x: Math.sqrt(3) * (tile.q + tile.r / 2) * Hexjs.size,
      y: 3 / 2 * tile.r * Hexjs.size
    };
  }

  function pixelToAxial(px, py) {
    return {
      q: (1 / 3 * Math.sqrt(3) * px - 1 / 3 * py) / Hexjs.size,
      r: 2 / 3 * py / Hexjs.size
    };
  }

  function pixelToCube (px, py) {
    var axial = Hexjs.pixelToAxial(px, py);
    var cube = Hexjs.axialToCube(axial.q, axial.r);
    return Hexjs.roundCube(cube.x, cube.y, cube.z);
  }

  function buildPoints (px, py) {
    var points = [];
    var angle;
    var i;

    for (i = 0; i < 6; ++i) {
      angle = 2 * Math.PI / 6 * (i + 0.5);
      points.push({x: px + Hexjs.size * Math.cos(angle), y: py + Hexjs.size * Math.sin(angle)});
    }

    return points;
  }

  function find (tiles, x, y, accessor) {
    accessor = accessor || _.identity;
    return _.find(tiles, function (tile) {
      tile = accessor(tile);
      return (tile.x === x && tile.y === y);
    });
  }

  function neighbors (tiles, x, y, accessor) {
    return _.filter(_.map(cubeNeighbors(x, y), function (neighbor) {
      return Hexjs.find(tiles, neighbor.x, neighbor.y, accessor);
    }), function (tile) {
      return !!tile;
    });
  }

  function interpolate(tiles, px, py, accessor) {
    var coords = pixelToCube(px, py);
    return Hexjs.find(tiles, coords.x, coords.y, accessor);
  }

  function interpolateNeighbors(tiles, px, py, accessor) {
    return _.filter(_.map(cubeNeighbors(px, py), function (neighbor) {
      return Hexjs.interpolate(tiles, neighbor.x, neighbor.y, accessor);
    }), function (tile) {
      return !!tile;
    });
  }

  // Definition of an hexagonal tile
  function Tile(coordsX, coordsY, coordsZ) {
    // Cube coordinates
    coordsZ = checkZ(coordsX, coordsY, coordsZ);
    this.x = coordsX;
    this.y = coordsY;
    this.z = coordsZ;

    // Axial coordinates
    var a = cubeToAxial(this.x, this.y, this.z);
    this.q = a.q;
    this.r = a.r;
    this.checkSize();
  }

  Tile.prototype.checkSize = function () {
    if (this.size !== Hexjs.size) {
      this.updateSize();
    }
  };

  Tile.prototype.updateSize = function () {
    this.size = Hexjs.size;
    this.center = this.toPixel();
  };

  Tile.prototype.distanceTo = function (tile) {
    return Hexjs.distance(this, tile);
  };

  Tile.prototype.toPixel = function () {
    return Hexjs.tileToPixel(this);
  };

  Tile.prototype.center = function () {
    this.checkSize();
    return this.center;
  };

  Tile.prototype.cubeNeighbors = function () {
    return Hexjs.cubeNeighbors(this.x, this.y, this.z);
  };

  Tile.prototype.neighbors = function (tiles, accessor) {
    return Hexjs.neighbors(tiles, this.x, this.y, this.z, accessor);
  };

  Tile.prototype.axialNeighbors = function () {
    return Hexjs.axialNeighbors(this.q, this.r);
  };

  Tile.prototype.isContained = function (x, y, dx, dy) {
    this.checkSize();
    return x < (this.center.x + Hexjs.width) &&
      x + dx > (this.center.x - Hexjs.width) &&
      y < (this.center.y + Hexjs.height) &&
      y + dy > (this.center.y - Hexjs.height);
  };

  // Hexjs defintion
  var Hexjs = {
    size: function (size) {
      if (size) {
        this.size = size;
        this.height = 2 * size;
        this.width = Math.sqrt(3) * size;
      } else {
        return this.size;
      }
    },
    axialToCube: axialToCube,
    cubeToAxial: cubeToAxial,
    buildPoints: buildPoints,
    distance: distance,
    cubeNeighbors: cubeNeighbors,
    axialNeighbors: axialNeighbors,
    roundCube: roundCube,
    tileToPixel: tileToPixel,
    pixelToAxial: pixelToAxial,
    pixelToCube: pixelToCube,
    find: find,
    neighbors: neighbors,
    interpolate: interpolate,
    interpolateNeighbors: interpolateNeighbors,
    tile: function (x, y, z) {
      return new Tile(x, y, z);
    }
  };

  Hexjs.size(30);
  window.Hexjs = Hexjs;
}(this));
