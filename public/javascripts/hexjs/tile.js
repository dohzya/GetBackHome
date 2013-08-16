var size = 24;

function Tile (coordsX, coordsY, coordsZ) {
  // Cube coordinates
  this.x = coordsX;
  this.y = coordsY;
  this.z = coordsZ ? coordsZ : -(coordsX + coordsY);

  // Axial coordinates
  this.q = this.x;
  this.r = this.z;
}

Tile.prototype.distanceTo = function (tile) {
  return distance(this, tile);
}

Tile.prototype.setSize = function (size) {
  this.centerX = size * Math.sqrt(3) * (this.q + this.r / 2);
  this.centerY = size * 3/2 * this.r;
  this.updatePoints();
}

Tile.prototype.updatePoints = function (size) {
  this.points = [];
  var angle;

  for (var i = 0; i < 6; ++i) {
    angle = 2 * Math.PI / 6 * (i + 0.5);
    points.push({x: this.centerX + size * Math.cos(angle), y: this.centerY + size * Math.sin(angle)});
  }
}

Tile.prototype.neighbors = function () {
  return [
    {x: this.x + 1, y: this.y - 1, z: this.z},
    {x: this.x + 1, y: this.y, z: this.z - 1},
    {x: this.x, y: this.y + 1, z: this.z - 1},
    {x: this.x - 1, y: this.y + 1, z: this.z},
    {x: this.x - 1, y: this.y, z: this.z + 1},
    {x: this.x, y: this.y - 1, z: this.z + 1}
  ];
}

Tile.prototype.axialNeighbors = function () {
  return [
    {q: this.q + 1, r: this.r},
    {q: this.q + 1, r: this.r - 1},
    {q: this.q, r: this.r - 1},
    {q: this.q - 1, r: this.r},
    {q: this.q - 1, r: this.r + 1},
    {q: this.q, r: this.r + 1}
  ];
}

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
    px: Math.sqrt(3) * (tile.q + tile.r / 2) * size,
    py: 3/2 * tile.r * size
  };
}

function pixelToAxialHex (px, py) {
  return {
    q: (1/3 * Math.sqrt(3) * px - 1/3 * py) / size,
    r: 2/3 * py / size
  };
}

function pixelToCubeHex (px, py) {
  var axial = pixelToAxialHex(px, py);
  return roundCubeHex(axial.q, -(axial.q + axial.r), axial.r);
}