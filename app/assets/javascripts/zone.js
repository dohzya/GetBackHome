"use strict";

GetHomeBack.Zone = function(zn){
    var zone = {};

    zone.x = zn.x;
    zone.y = zn.y;
    zone.dx = zn.dx;
    zone.dy = zn.dy;
    zone.color = zn.color;
    zone.infos = zn.infos;

    zone.draw = function(ctx){
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x, zone.y, zone.dx, zone.dy);
    };

    zone.onClick = function(e){
        return zone.drawClick(function(){
            GetHomeBack.status.displayZone(zone);
            e.drawer.redraw();
        });
    };

    zone.drawClick = function(f){
        var old, res;
        old = zone.color;
        zone.color = "yellow";
        res = f();
        zone.color = old;
        return res;
    };

    return zone;
};
