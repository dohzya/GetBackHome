GetHomeBack.Zone = function(x, y, color){
    var zone = {};

    zone.x = x;
    zone.y = y;
    zone.dx = 50;
    zone.dy = 50;
    zone.color = color;

    zone.draw = function(ctx){
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x, zone.y, zone.dx, zone.dy);
    };

    zone.onClick = function(e){
        return zone.drawClick(function(){
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
