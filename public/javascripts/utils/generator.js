app.service("UTGenerator", ["UTPerlinSimplex", "Rc4Random", function (PerlinSimplex, Rc4Random) {
  "use strict";

  function initNoise(seed) {
    PerlinSimplex.noiseDetail();
    var seedRand = Rc4Random.create(seed);
    var rand = {
      random: function(){ return seedRand.getRandomNumber(); }
    };
    PerlinSimplex.setRng(rand);
  }

  function gen(kind) {
    return function(x, y) {
      return PerlinSimplex.noise(kind, x, y);
    };
  }

  function generate(seed, minX, maxX, minY, maxY, f) {
    initNoise(seed);
    var infectionGen = gen(0);
    var type1Gen = gen(1);
    var type2Gen = gen(2);
    var youthGen = gen(3);
    var zones = [];
    for (var xx=minX; xx<maxX; xx++) {
      for (var yy=minY; yy<maxY; yy++) {
        var x = xx - 10;
        var y = yy - 10;
        var infection = parseInt(Math.abs(infectionGen(x, y) * 100), 10);
        var youth = parseInt(Math.abs(youthGen(x, y) * 100), 10) * 10;
        var height = parseInt((type1Gen(x, y) * 130 + 200), 10) * 2;
        var types;
        var type2Int = parseInt((type2Gen(x, y) * 1000), 10);
        var t2;
        if (height < 24) {
          if (type2Int > 300) {
            t2 = "city";
          }
          else {
            t2 = null;
          }
          types = ["water", t2];
        }
        else if (height < 30) {
          t2 = null;
          types = ["swamp", t2];
        }
        else if (height < 600) {
          if (type2Int < -200) {
            t2 = "city";
          }
          else if (type2Int < -100) {
            t2 = "forrest";
          }
          else if (type2Int < -50) {
            t2 = "field";
          }
          else {
            t2 = null;
          }
          types = ["plain", t2];
        }
        else {
          if (type2Int < -400) {
            t2 = "city";
          }
          else if (type2Int < -200) {
            t2 = "forrest";
          }
          else if (height > 750) {
            t2 = "mountains";
          }
          else {
            t2 = null;
          }
          types = ["mountainous", t2];
        }
        var zone = {
          pos: [x, y],
          ts: 0,
          height: height,
          types: types,
          infection: infection,
          youth: youth
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
