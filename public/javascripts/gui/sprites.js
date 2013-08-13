GetBackHome.Sprite = (function (GetBackHome) {
  "use strict";

  function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  Sprite.prototype.draw = function (ctx, x, y, width, height) {
    var dx = width || this.width;
    var dy = height || this.height;
    ctx.drawImage(this.img, this.x, this.y, this.height, this.width, x, y, dx, dy);
  };

  var Class = function (img, x, y, width, height) {
    return new Sprite(img, x, y, width, height);
  };

  return Class;
})(GetBackHome);

GetBackHome.sprites = (function (GetBackHome) {
  var sprites = function (name) {
    return sprites.tiles[name];
  };

  sprites.init = function (opts, andThen) {
    var img = new Image();
    sprites.img = img;
    sprites.img.onload = function () {
      var k, v, x, y, width, height;
      sprites.tiles = {};
      for (k in opts.sprites.tiles) {
        v = opts.sprites.tiles[k];
        x = v[0];
        y = v[1];
        width = v[2];
        height = v[3];
        sprites.tiles[k] = GetBackHome.Sprite(img, x, y, width, height);
      }
      function loadImg(infos, andThen) {
        var name = infos.name,
          _width = infos.width,
          _height = infos.height,
          src = infos.src;
        var _img = new Image();
        _img.onload = function () {
          sprites.tiles[name] = GetBackHome.Sprite(_img, 0, 0, _width, _height);
          andThen();
        };
        _img.src = src;
      }
      function loadImgs(imgs, andThen) {
        var _img = imgs.shift();
        if (_img) {
          loadImg(_img, function () { loadImgs(imgs, andThen); });
        } else {
          andThen();
        }
      }
      loadImgs([
        {name: "mountains",   height: 157, width: 157, src: "/assets/images/mountains.svg"},
        {name: "water",     height: 157, width: 157, src: "/assets/images/water.svg"},
        {name: "grass",     height: 157, width: 157, src: "/assets/images/grass.svg"},
        {name: "mountainous", height: 184, width: 148, src: "/assets/images/mountainous.svg"},
        false
      ], function () { andThen(); });
    };
    sprites.img.src = opts.sprites.src;
  };

  return sprites;
})(GetBackHome);
