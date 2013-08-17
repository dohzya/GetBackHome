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
    }
  };

  // Generic functions
  function distance (tile1, tile2) {
    return Math.max(Math.abs(tile1.x - tile2.x), Math.abs(tile1.y - tile2.y), Math.abs(tile1.z - tile2.z));
  }

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
    return roundCubeHex(axial.q, -(axial.q + axial.r), axial.r);
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

  function interpolate (tiles, px, py, accessor) {
    var coords = pixelToCubeHex(px, py);
    return this.find(tiles, coords.x, coords.y, accessor);
  }

  // Definition of an hexagonal tile
  function Tile (coordsX, coordsY, coordsZ) {
    // Cube coordinates
    this.x = coordsX;
    this.y = coordsY;
    this.z = coordsZ ? coordsZ : -(coordsX + coordsY);

    // Axial coordinates
    this.q = this.x;
    this.r = this.z;
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
    return [
      {x: this.x + 1, y: this.y - 1, z: this.z},
      {x: this.x + 1, y: this.y, z: this.z - 1},
      {x: this.x, y: this.y + 1, z: this.z - 1},
      {x: this.x - 1, y: this.y + 1, z: this.z},
      {x: this.x - 1, y: this.y, z: this.z + 1},
      {x: this.x, y: this.y - 1, z: this.z + 1}
    ];
  };

  Tile.prototype.axialNeighbors = function () {
    return [
      {q: this.q + 1, r: this.r},
      {q: this.q + 1, r: this.r - 1},
      {q: this.q, r: this.r - 1},
      {q: this.q - 1, r: this.r},
      {q: this.q - 1, r: this.r + 1},
      {q: this.q, r: this.r + 1}
    ];
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
    roundCubeHex: roundCubeHex,
    tileToPixel: tileToPixel,
    pixelToAxialHex: pixelToAxialHex,
    pixelToCubeHex: pixelToCubeHex,
    find: find,
    interpolate: interpolate,
    tile: function (x, y, z) {
      return new Tile(x, y , z);
    }
  };

  Hexjs.size(30);
  window.Hexjs = Hexjs;
}(this));