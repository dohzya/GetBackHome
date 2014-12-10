"use strict";

import * as Immutable from 'immutable';
import PerlinSimplex from './perlinSimplex.js';
import Rc4Random from './rc4Random.js';
import Biomes from '../biomes.js';
import {Forest, Mountain, City} from '../structures.js';

function initNoise(seed) {
  PerlinSimplex.noiseDetail();
  Rc4Random.init(seed);
  PerlinSimplex.setRng({random: Rc4Random.random});
}

function gen(kind) {
  return function (x, y) {
    return PerlinSimplex.noise(kind, x, y);
  };
}

function generate(seed, minX, maxX, minY, maxY, f) {
  initNoise(seed);
  var infectionGen = gen(0);
  var type1Gen = gen(1);
  var type2Gen = gen(2);
  var attackGen = gen(4);
  var defenseGen = gen(5);
  var foodGen = gen(6);
  var zones = [];
  var xx, yy;
  var x, y, infection, height, types, type2Int, attack, defense, food, t2, zone, biome, structure;
  for (xx = minX; xx < maxX; xx++) {
    for (yy = minY; yy < maxY; yy++) {
      x = xx - 10;
      y = yy - 10;
      infection = parseInt(Math.abs(infectionGen(x, y) * 10), 10);
      height = parseInt((type1Gen(x, y) * 1000), 10) - 50;
      type2Int = parseInt((type2Gen(x, y) * 1000), 10);
      attack = attackGen(x, y);
      attack = attack * attack;  // lower the value (but keeping 1 possible)
      attack = attack * 10;
      defense = defenseGen(x, y);
      defense = defense * defense;  // lower the value (but keeping 1 possible)
      defense = defense * 10;
      food = parseInt((foodGen(x, y) * 100), 10);
      structure = null;

      if (height < 24) {
        biome = Biomes.water;

        if (type2Int > 950) {
          structure = new City();
        }
      } else if (height < 30) {
        biome = Biomes.desert;
      } else if (height < 600) {
        biome = Biomes.plain;

        if (type2Int < 100) {
          structure = new City();
        } else if (type2Int < 300) {
          structure = new Forest();
        } else if (type2Int < 500) {
          t2 = "field";
        } else {
          t2 = null;
        }
      } else {
        biome = Biomes.mountainous;

        if (type2Int < 100) {
          structure = new City();
        } else if (type2Int < 600) {
          structure = new Forest();
        } else if (height > 800) {
          structure = new Mountain();
        } else {
          t2 = null;
        }
      }

      zone = {
        fighting: {
          attack: attack,
          defense: defense
        },
        food: food,
        height: height,
        horde: 0, // Hordes.create(infection),  // TODO generate
        x: x,
        y: y,
        ts: 0,
        biome: biome,
        structure: structure
      };
      zones.push(f ? f(zone) : zone);
    }
  }
  return Immutable.fromJS(zones);
}

export default {generate: generate};
