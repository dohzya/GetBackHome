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
    zone.infectionAlpha = 1-(zone.infos.infection/1.5);

    if (zone.infos.zoneType == "city") {
        zone.color = "rgba(127, 127, 127, "+zone.infectionAlpha+")";
    }
    else if (zone.infos.zoneType == "field") {
        zone.color = "rgba(191, 127, 15, "+zone.infectionAlpha+")";
    }
    else if (zone.infos.zoneType == "water") {
        zone.color = "rgba(0, 0, 127, "+zone.infectionAlpha+")";
    }
    else if (zone.infos.zoneType == "boue") {
        zone.color = "rgba(127, 63, 31, "+zone.infectionAlpha+")";
    }
    else if (zone.infos.zoneType == "plaine") {
        zone.color = "rgba(0, 127, 0, "+zone.infectionAlpha+")";
    } else {
        zone.color = "black";
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
