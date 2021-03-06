import * as assign from 'lodash-node/modern/objects/assign';
import Config from './config.js';
import Tile from './tile.js';

function isNumber(value) {
  return typeof value === "number" || toString.call(value) === "[object Number]";
}

function isFunction(value) {
  return typeof value === "function";
}

function identity(value) {
  return value;
}

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
    x: Math.sqrt(3) * (tile.q + tile.r / 2) * Config.size(),
    y: 3 / 2 * tile.r * Config.size()
  };
}

function pixelToAxial(px, py) {
  return {
    q: (1 / 3 * Math.sqrt(3) * px - 1 / 3 * py) / Config.size(),
    r: 2 / 3 * py / Config.size()
  };
}

function pixelToCube (px, py, pz) {
  var axial = pixelToAxial(px, py, pz);
  var cube = axialToCube(axial.q, axial.r);
  return roundCube(cube.x, cube.y, cube.z);
}

function buildPoints (px, py) {
  var points = [];
  var angle;
  var i;

  for (i = 0; i < 6; ++i) {
    angle = 2 * Math.PI / 6 * (i + 0.5);
    points.push({x: px + Config.size() * Math.cos(angle), y: py + Config.size() * Math.sin(angle)});
  }

  return points;
}

function neighbors(at, x, y, z) {
  return cubeNeighbors(x, y, z).map(function (neighbor) {
    return at(neighbor.x, neighbor.y, neighbor.z);
  }).filter(function (tile) {
    return !!tile;
  });
}

function interpolate(at, px, py) {
  const coords = pixelToCube(px, py);
  return at(coords.x, coords.y);
}

function interpolateNeighbors(at, px, py) {
  return cubeNeighbors(px, py).map(function (neighbor) {
    return interpolate(at, neighbor.x, neighbor.y);
  }).filter(function (tile) {
    return !!tile;
  });
}

export default {
  isNumber: isNumber,
  isFunction: isFunction,
  identity: identity,
  extend: assign,
  checkZ: checkZ,
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
  neighbors: neighbors,
  interpolate: interpolate,
  interpolateNeighbors: interpolateNeighbors
};
