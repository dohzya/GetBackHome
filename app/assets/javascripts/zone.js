"use strict";

GetHomeBack.Zone = (function(GetHomeBack){
    function Class(zn, opts){
        this.x = zn.x;
        this.y = zn.y;
        this.dx = zn.width;
        this.dy = zn.height;
        this.infos = zn.infos;
        this.alphaInfection = 1-(this.infos.infection / 100.0);
        this.alphaYouth = 1-(this.infos.youth / 100.0);

        if (this.infos.type1 === "water"){
            this.color = "0, 63, 200";
        }
        else if (this.infos.type1 === "swamp"){
            this.color = "127, 63, 31";
        }
        else if (this.infos.type1 === "plain"){
            this.color = "0, 127, 0";
        }
        else if (this.infos.type1 === "mountainous"){
            this.color = "127, 127, 127";
        }
        else {
            this.color = "0, 0, 0";
        }

        if (this.infos.type2) {
            this.image = GetHomeBack.sprites(this.infos.type2);
        }
        else {
            this.image = GetHomeBack.sprites("grass");
        }

    }

    Class.prototype.draw = function(ctx, x, y){
        ctx.fillStyle = "rgba("+this.color+", "+this.alphaInfection+")";
        ctx.fillRect(this.x-x, this.y-y, this.dx, this.dy);
        if (this.image) {
            var oldGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = this.alphaYouth;
            this.image.draw(ctx, this.x-x, this.y-y);
            ctx.globalAlpha = oldGlobalAlpha;
        }
    };

    Class.prototype.onClick = function(e){
    };

    Class.prototype.onSelected = function(){
        this.oldColor = this.color;
        this.color = "255, 250, 71";
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
