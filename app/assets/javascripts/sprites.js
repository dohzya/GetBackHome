GetBackHome.Sprite = (function(GetBackHome){
    "use strict";

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

    var Class = function(img, x, y, width, height) {
        return new Sprite(img, x, y, width, height);
    };

    return Class;
})(GetBackHome);

GetBackHome.sprites = (function(GetBackHome){
    var sprites = function(name){
        return sprites.tiles[name];
    };

    sprites.init = function(opts, andThen){
        var img = new Image();
        sprites.img = img;
        sprites.img.onload = function(){
            sprites.tiles = {};
            for (var k in opts.sprites.tiles) {
                var v = opts.sprites.tiles[k];
                var x = v[0], y = v[1], width = v[2], height = v[3];
                sprites.tiles[k] = GetBackHome.Sprite(img, x, y, width, height);
            }
            function loadImg(infos, andThen) {
                var name = infos.name,
                    width = infos.width,
                    height = infos.height;
                var src = "/assets/images/"+name+".svg";
                var img = new Image();
                img.onload = function() {
                    sprites.tiles[name] = GetBackHome.Sprite(img, 0, 0, width, height);
                    andThen();
                };
                img.src = src;
            }
            function loadImgs(imgs, andThen) {
                var img = imgs.shift();
                if (img) {
                    loadImg(img, function(){ loadImgs(imgs, andThen); });
                }
                else { andThen(); }
            }
            loadImgs([
                {name: "mountains", width: 157, height: 157},
                {name: "water", width: 157, height: 157},
                {name: "grass", width: 157, height: 157},
            ], function(){ andThen(); });
        };
        sprites.img.src = opts.sprites.src;
    };

    return sprites;
})(GetBackHome);
