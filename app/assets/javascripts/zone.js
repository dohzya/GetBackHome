"use strict";

GetHomeBack.Zone = (function(GetHomeBack){
    function Class(zn){
        this.x = zn.x;
        this.y = zn.y;
        this.dx = zn.width;
        this.dy = zn.height;
        this.infos = zn.infos;
        this.infectionAlpha = 1-(this.infos.infection/1.5);
        this.infos.infection = this.infos.infection.toPrecision(3);

        if (this.infos.type2 == "city"){
            this.color = "rgba(127, 127, 127, "+this.infectionAlpha+")";
        }
        else if (this.infos.type2 == "forrest"){
            this.color = "rgba(0, 127, 0, "+this.infectionAlpha+")";
        }
        else if (this.infos.type2 == "field"){
            this.color = "rgba(191, 127, 15, "+this.infectionAlpha+")";
        }
        else if (this.infos.type1 == "water"){
            this.color = "rgba(0, 0, 127, "+this.infectionAlpha+")";
        }
        else if (this.infos.type1 == "boue"){
            this.color = "rgba(127, 63, 31, "+this.infectionAlpha+")";
        }
        else if (this.infos.type1 == "plaine"){
            this.color = "rgba(0, 127, 0, "+this.infectionAlpha+")";
        }
        else if (this.infos.type1 == "montains"){
            this.color = "rgba(0, 127, 0, "+this.infectionAlpha+")";
        }
        else {
            this.color = "black";
        }
    }

    Class.prototype.draw = function(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.dx, this.dy);
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

    function Zone(zn){
        return new Class(zn);
    }

    return Zone;
})(GetHomeBack);
