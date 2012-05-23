GetHomeBack.Sprite = (function(GetHomeBack){
    "use strict";

    function Class(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Class.prototype.draw = function(ctx, x, y) {
        ctx.drawImage(GetHomeBack.sprites.img, this.x, this.y, this.height, this.width, x, y, this.height, this.width);
    };

    var Sprite = function(x, y, width, height) {
        return new Class(x, y, width, height);
    };

    return Sprite;
})(GetHomeBack);

GetHomeBack.sprites = (function(GetHomeBack){
    var sprites = function(name){
        return sprites.tiles[name];
    };

    sprites.init = function(opts, andThen){
        sprites.img = new Image();
        sprites.img.onload = function(){
            sprites.tiles = {};
            for (var k in opts.sprites.tiles) {
                var v = opts.sprites.tiles[k];
                var x = v[0], y = v[1], width = v[2], height = v[3];
                sprites.tiles[k] = GetHomeBack.Sprite(x, y, width, height);
            }
            andThen();
        };
        sprites.img.src = opts.sprites.src;
    };

    return sprites;
})(GetHomeBack);
