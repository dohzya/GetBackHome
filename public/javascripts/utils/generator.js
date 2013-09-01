app.service("UTGenerator", ["UTPerlinSimplex", "Rc4Random", "Hordes", function (PerlinSimplex, Rc4Random, Hordes) {
  "use strict";

  function initNoise(seed) {
    PerlinSimplex.noiseDetail();
    var seedRand = Rc4Random.create(seed);
    var rand = {
      random: function () { return seedRand.getRandomNumber(); }
    };
    PerlinSimplex.setRng(rand);
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
    var x, y, infection, height, types, type2Int, attack, defense, food, t2, zone;
    for (xx = minX; xx < maxX; xx++) {
      for (yy = minY; yy < maxY; yy++) {
        x = xx - 10;
        y = yy - 10;
        infection = parseInt(Math.abs(infectionGen(x, y) * 100), 10);
        height = parseInt((type1Gen(x, y) * 1000), 10) - 50;
        type2Int = parseInt((type2Gen(x, y) * 1000), 10);
        attack = attackGen(x, y);
        attack = attack * attack;  // lower the value (but keeping 1 possible)
        defense = defenseGen(x, y);
        defense = defense * defense;  // lower the value (but keeping 1 possible)
        food = parseInt((foodGen(x, y) * 100), 10);
        if (height < 24) {
          if (type2Int > 950) {
            t2 = "city";
          } else {
            t2 = null;
          }
          types = ["water", t2];
        } else if (height < 30) {
          t2 = null;
          types = ["swamp", t2];
        } else if (height < 600) {
          if (type2Int < 100) {
            t2 = "city";
          } else if (type2Int < 300) {
            t2 = "forrest";
          } else if (type2Int < 500) {
            t2 = "field";
          } else {
            t2 = null;
          }
          types = ["plain", t2];
        } else {
          if (type2Int < 100) {
            t2 = "city";
          } else if (type2Int < 600) {
            t2 = "forrest";
          } else if (height > 800) {
            t2 = "mountains";
          } else {
            t2 = null;
          }
          types = ["mountainous", t2];
        }
        zone = {
          fighting: {
            attack: attack,
            defense: defense
          },
          food: food,
          height: height,
          horde: Hordes.create(infection),  // TODO generate
          pos: [x, y],
          ts: 0,
          types: types
        };
        zones.push(f ? f(zone) : zone);
      }
    }
    return zones;
  }

  return {
    generate: generate
  };
}]);
