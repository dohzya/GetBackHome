app.factory("GUISprites", ["$q", function ($q) {
  var png = {
    src: "/assets/images/sprites.png",
    tiles:{
      cursor: [0, 0, 20, 20],
      cursorSelected: [20, 0, 20, 20],

      city: [52, 0, 52, 52],
      forest: [0, 52, 52, 52],
      field: [104, 0, 52, 52],
      grass: [104, 52, 52, 52],
      water: [104, 104, 52, 52],
      mountains: [52, 104, 52, 52]
    }
  };

  var svg = [
    {name: "mountains",   height: 157, width: 157, src: "/assets/images/mountains.svg"},
    {name: "water",       height: 157, width: 157, src: "/assets/images/water.svg"},
    {name: "grass",       height: 157, width: 157, src: "/assets/images/grass.svg"},
    {name: "mountainous", height: 184, width: 148, src: "/assets/images/mountainous.svg"}
  ];

  var tiles = {};

  function Sprite(img, x, y, width, height) {
      this.img = img;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  }

  Sprite.prototype.draw = function(ctx, x, y, width, height) {
      var dx = width || this.width;
      var dy = height || this.height;
      ctx.drawImage(this.img, this.x, this.y, this.height, this.width, x, y, dx, dy);
  };

  function create (img, x, y, width, height) {
      return new Sprite(img, x, y, width, height);
  };
  
  function loadPNG() {
    var deferred = Q.defer();

    var img = new Image();
    img.onload = function(){
      for (var k in png.tiles) {
          var v = png.tiles[k];
          var x = v[0], y = v[1], width = v[2], height = v[3];
          tiles[k] = create(img, x, y, width, height);
      }
img
      deferred.resolve();
    };

    img.src = png.src;

    return deferred.promise;
  }

  function loadSVG() {
    var deferred = Q.defer();

    _.each(svg, function (s, index) {
      s.img = new Image();
      s.img.onload = function() {
        tiles[s.name] = create(s.img, 0, 0, s.width, s.height);

        if (index == svg.length - 1) {
          deferred.resolve(tiles);
        }
      };

      s.img.src = s.src;
    });

    return deferred.promise;
  }

  var promisedTiles = loadPNG().then(loadSVG);

  function get(name) {
    return tiles[name];
  }

  function getTiles() {
    return tiles;
  }

  return {
    create: create,
    isLoaded: function () { return promisedTiles; },
    get: get,
    getTiles: getTiles
  }
}]);