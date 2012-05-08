"use strict";

GetHomeBack.Zone = function(zn){
    var zone = {};

    zone.Infos = function(i){
        var infos = {};

        infos.zoneType = i.zoneType;
        infos.infection = i.infection;

        return infos;
    };

    zone.x = zn.x;
    zone.y = zn.y;
    zone.dx = zn.dx;
    zone.dy = zn.dy;
    zone.infos = zone.Infos(zn.infos);

    if (zone.infos.zoneType == "montains") {
        zone.color = "blue";
    }
    else if (zone.infos.zoneType == "city") {
        zone.color = "red";
    }
    else {
        zone.color = "green";
    }

    zone.draw = function(ctx){
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x, zone.y, zone.dx, zone.dy);
    };

    zone.onClick = function(e){
        e.drawer.redraw();
    };

    zone.onSelected = function(){
        zone.oldColor = zone.color;
        zone.color = "yellow";
        GetHomeBack.status.displayZone(zone);
    };

    zone.onUnSelected = function(){
        zone.color = zone.oldColor;
    };

    return zone;
};
