"use strict";

import * as Immutable from 'immutable';
import PerlinSimplex from './perlinSimplex.js';
import Rc4Random from './rc4Random.js';
import Biomes from '../biomes.js';
import {Forest, Mountain, City, Field} from '../structures.js';

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
  var x, y, infection, height, structureInt, attack, defense, food, t2, zone, biome, structure;
  for (xx = minX; xx < maxX; xx++) {
    for (yy = minY; yy < maxY; yy++) {
      x = xx - 10;
      y = yy - 10;
      infection = parseInt(Math.abs(infectionGen(x, y) * 10), 10);
      height = parseInt((type1Gen(x, y) * 1000), 10) - 50;
      structureInt = parseInt((type2Gen(x, y) * 1000), 10);
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

        if (structureInt > 950) {
          structure = new City();
        }
      } else if (height < 30) {
        biome = Biomes.desert;
      } else if (height < 600) {
        biome = Biomes.plain;

        if (structureInt < 100) {
          structure = new City();
        } else if (structureInt < 300) {
          structure = new Forest();
        } else if (structureInt < 500) {
          structure = new Field();
        }
      } else {
        // Uncomment me and see that nearly all structureInt are around 500 creating a bunch lot of forests
        // console.log('mountainous', height, structureInt);
        biome = Biomes.mountainous;

        if (structureInt < 100) {
          structure = new City();
        } else if (structureInt < 600) {
          structure = new Forest();
        } else if (height > 800) {
          structure = new Mountain();
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
