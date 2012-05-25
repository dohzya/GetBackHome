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
            andThen();
        };
        sprites.img.src = opts.sprites.src;
    };

    return sprites;
})(GetHomeBack);
