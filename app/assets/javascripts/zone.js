"use strict";

GetHomeBack.Zone = (function(GetHomeBack){
    function Class(zn, opts){
        function createImg(src){
            if (src) {
                var img = new Image();
                img.src = src;
                return img;
            }
            else return null;
        }

        this.x = zn.x;
        this.y = zn.y;
        this.dx = zn.width;
        this.dy = zn.height;
        this.infos = zn.infos;
        this.alpha = 1-(this.infos.infection/1.5);
        this.infos.infection = this.infos.infection.toPrecision(3);

        if (this.infos.type2 == "city"){
            this.image = createImg(opts.tiles[this.infos.type2]);
            this.color = "rgba(127, 127, 127, "+this.alpha+")";
        }
        else if (this.infos.type2 == "forrest"){
            this.image = createImg(opts.tiles[this.infos.type2]);
            this.color = "rgba(0, 127, 0, "+this.alpha+")";
        }
        else if (this.infos.type2 == "field"){
            this.image = createImg(opts.tiles[this.infos.type2]);
            this.color = "rgba(191, 127, 15, "+this.alpha+")";
        }
        else if (this.infos.type1 == "water"){
            this.image = createImg(opts.tiles[this.infos.type1]);
            this.color = "rgba(0, 0, 127, "+this.alpha+")";
        }
        else if (this.infos.type1 == "boue"){
            this.image = createImg(opts.tiles[this.infos.type1]);
            this.color = "rgba(127, 63, 31, "+this.alpha+")";
        }
        else if (this.infos.type1 == "grass"){
            this.image = createImg(opts.tiles[this.infos.type1]);
            this.color = "rgba(0, 127, 0, "+this.alpha+")";
        }
        else if (this.infos.type1 == "montains"){
            this.image = createImg(opts.tiles[this.infos.type1]);
            this.color = "rgba(0, 127, 0, "+this.alpha+")";
        }
        else {
            this.color = "black";
        }
    }

    Class.prototype.draw = function(ctx, x, y){
        if (this.image) {
            var oldGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = this.alpha;
            ctx.drawImage(this.image, this.x-x, this.y-y);
            ctx.globalAlpha = oldGlobalAlpha;
        }
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x-x, this.y-y, this.dx, this.dy);
        }
    };

    Class.prototype.onClick = function(e){
        e.drawer.redraw();
    };

    Class.prototype.onSelected = function(){
        this.oldColor = this.color;
        this.color = "yellow";
        GetHomeBack.status.displayZone(this);
    };

    Class.prototype.onUnSelected = function(){
        this.color = this.oldColor;
    };

    function Zone(zn, opts){
        return new Class(zn, opts);
    }

    return Zone;
})(GetHomeBack);
