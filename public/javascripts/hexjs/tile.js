;(function(window) {
  // Rely on a library like Lo-Dash or Underscore
  // but here is a small fallback if missing
  var _ = window._ || {
    isFunction: function (value) {
      return typeof value == 'function';
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
  function axialToCube (q, r) {
    return {
      x: r,
      y: q,
      z: -(r + q)
    };
  }

  function cubeToAxial (x, y, z) {
    return {
      q: y,
      r: x
    };
  }


  function distance (tile1, tile2) {
    return Math.max(Math.abs(tile1.x - tile2.x), Math.abs(tile1.y - tile2.y), Math.abs(tile1.z - tile2.z));
  }

  function neighbors (x, y, z) {
    return [
      {x: x + 1, y: y - 1, z: z},
      {x: x + 1, y: y, z: z - 1},
      {x: x, y: y + 1, z: z - 1},
      {x: x - 1, y: y + 1, z: z},
      {x: x - 1, y: y, z: z + 1},
      {x: x, y: y - 1, z: z + 1}
    ];
  };

  function axialNeighbors (q, r) {
    return [
      {q: q + 1, r: r},
      {q: q + 1, r: r - 1},
      {q: q, r: r - 1},
      {q: q - 1, r: r},
      {q: q - 1, r: r + 1},
      {q: q, r: r + 1}
    ];
  };

  function roundCubeHex (x, y, z) {
    var rx = Math.round(x);
    var ry = Math.round(y);
    var rz = Math.round(z);

    var x_err = Math.abs(rx - x);
    var y_err = Math.abs(ry - y);
    var z_err = Math.abs(rz - z);

    if (x_err > y_err && x_err > z_err) {
      rx = -ry-rz;
    }
    else if (y_err > z_err) {
      ry = -rx-rz;
    }
    else {
      rz = -rx-ry;
    }

    return {
      x: rx,
      y: ry,
      z: rz
    };
  }

  function tileToPixel (tile) {
    return {
      x: Math.sqrt(3) * (tile.q + tile.r / 2) * Hexjs.size,
      y: 3/2 * tile.r * Hexjs.size
    };
  }

  function pixelToAxialHex (px, py) {
    return {
      q: (1/3 * Math.sqrt(3) * px - 1/3 * py) / Hexjs.size,
      r: 2/3 * py / Hexjs.size
    };
  }

  function pixelToCubeHex (px, py) {
    var axial = pixelToAxialHex(px, py);
    var cube = axialToCube(axial.q, axial.r);
    return roundCubeHex(cube.x, cube.y, cube.z);
  }

  function buildPoints (px, py) {
    var points = [];
    var angle;

    for (var i = 0; i < 6; ++i) {
      angle = 2 * Math.PI / 6 * (i + 0.5);
      points.push({x: px + Hexjs.size * Math.cos(angle), y: py + Hexjs.size * Math.sin(angle)});
    }

    return points;
  }

  function find (tiles, x, y, accessor) {
    accessor = accessor || _.identity;
    return _.find(tiles, function (tile) {
      tile = accessor(tile);
      return (tile.x == x && tile.y == y);
    });
  }

  function findNeighbors (tiles, x, y, accessor) {
    return _.map(neighbors(x, y), function (neighbor) {
      return find(tiles, neighbor.x, neighbor.y, accessor);
    });
  }

  function interpolate (tiles, px, py, accessor) {
    var coords = pixelToCubeHex(px, py);
    return this.find(tiles, coords.x, coords.y, accessor);
  }

  function interpolateNeighbors (tiles, px, py, accessor) {
    return _.map(neighbors(px, py), function (neighbor) {
      return interpolate(tiles, neighbor.x, neighbor.y, accessor);
    });
  }

  // Definition of an hexagonal tile
  function Tile (coordsX, coordsY, coordsZ) {
    // Cube coordinates
    this.x = coordsX;
    this.y = coordsY;
    this.z = coordsZ ? coordsZ : -(coordsX + coordsY);

    // Axial coordinates
    this.q = this.y;
    this.r = this.x;
    this.checkSize();
  }

  Tile.prototype.checkSize = function () {
    if (this.size != Hexjs.size) {
      this.updateSize();
    }
  };

  Tile.prototype.updateSize = function () {
    this.size = Hexjs.size;
    this.center = this.toPixel();
  };

  Tile.prototype.distanceTo = function (tile) {
    return distance(this, tile);
  };

  Tile.prototype.toPixel = function () {
    return tileToPixel(this);
  };

  Tile.prototype.center = function () {
    this.checkSize();
    return this.center;
  };

  Tile.prototype.neighbors = function () {
    return neighbors(this.x, this.y, this.z);
  };

  Tile.prototype.findNeighbors = function (tiles, accessor) {
    return findNeighbors(tiles, this.x, this.y, this.z, accessor);
  };

  Tile.prototype.axialNeighbors = function () {
    return axialNeighbors(this.q, this.r);
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
    buildPoints: buildPoints,
    distance: distance,
    neighbors: neighbors,
    axialNeighbors: axialNeighbors,
    roundCubeHex: roundCubeHex,
    tileToPixel: tileToPixel,
    pixelToAxialHex: pixelToAxialHex,
    pixelToCubeHex: pixelToCubeHex,
    find: find,
    findNeighbors: findNeighbors,
    interpolate: interpolate,
    interpolateNeighbors: interpolateNeighbors,
    tile: function (x, y, z) {
      return new Tile(x, y , z);
    }
  };

  Hexjs.size(30);
  window.Hexjs = Hexjs;
}(this));