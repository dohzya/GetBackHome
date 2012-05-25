GetHomeBack.Sprite = (function(GetHomeBack){
    "use strict";

    function Class(img, x, y, width, height) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Class.prototype.draw = function(ctx, x, y, width, height) {
        var dx = width || this.width;
        var dy = height || this.height;
        ctx.drawImage(this.img, this.x, this.y, this.height, this.width, x, y, dx, dy);
    };

    var Sprite = function(img, x, y, width, height) {
        return new Class(img, x, y, width, height);
    };

    return Sprite;
})(GetHomeBack);

GetHomeBack.sprites = (function(GetHomeBack){
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
                sprites.tiles[k] = GetHomeBack.Sprite(img, x, y, width, height);
            }
            // tmp
            var img2 = new Image();
            img2.onload = function(){
                sprites.tiles["mountains"] = GetHomeBack.Sprite(img2, 0, 0, 157, 157);
                var img3 = new Image();
                img3.onload = function(){
                    sprites.tiles["water"] = GetHomeBack.Sprite(img3, 0, 0, 157, 157);
                    var img4 = new Image();
                    img4.onload = function(){
                        sprites.tiles["grass"] = GetHomeBack.Sprite(img4, 0, 0, 157, 157);
                        andThen();
                    };
                    img4.src = "/assets/images/grass.svg";
                };
                img3.src = "/assets/images/water.svg";
            };
            img2.src = "/assets/images/mountains.svg";
            // -
            // andThen();
        };
        sprites.img.src = opts.sprites.src;
    };

    return sprites;
})(GetHomeBack);
