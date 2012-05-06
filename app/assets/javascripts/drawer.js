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

    return zone;
};

GetHomeBack.Cursor = (function(){
    var cursor = {};
    cursor.x = 100;
    cursor.y = 100;
    cursor.dx = 10;
    cursor.dy = 10;
    cursor.color = "yellow";

    cursor.getX = function(e){
        x = e.pageX - (cursor.dx/2);
        x = GetHomeBack.drawer.globalToRelativeX(x);
        if (x < 0) x = 0;
        return x;
    };

    cursor.getY = function(e){
        y = e.pageY - (cursor.dy/2);
        y = GetHomeBack.drawer.globalToRelativeY(y);
        if (y < 0) y = 0;
        return y;
    };

    cursor.setXY = function(e){
        cursor.x = cursor.getX(e);
        cursor.y = cursor.getY(e);
    };

    cursor.onMouseMove = function(e){
        cursor.setXY(e);
        GetHomeBack.drawer.draw();
        return true;
    };

    cursor.onClick = function(e){
        cursor.setXY(e);
        var old = cursor.color;
        cursor.color = "red";
        GetHomeBack.drawer.draw();
        var res = GetHomeBack.drawer.click({
            x: cursor.x,
            y: cursor.y
        });
        cursor.color = old;
        return res;
    };

    cursor.init = function(){
        GetHomeBack.drawer.canvas.onmousemove = cursor.onMouseMove;
        GetHomeBack.drawer.canvas.onclick = cursor.onClick;
    };

    cursor.draw = function(ctx){
        ctx.fillStyle = cursor.color;
        ctx.fillRect(cursor.x, cursor.y, cursor.dx, cursor.dy);
    };

    return cursor;
})();

GetHomeBack.drawer = (function(){
    var drawer = {};

    drawer.canvas = null;
    drawer.ctx = null;
    drawer.offsetTop = null;
    drawer.offsetLeft = null;
    drawer.offsetRight = null;
    drawer.offsetBottom = null;
    drawer.height = null;
    drawer.width = null;
    drawer.drawables = [];
    drawer.zones = [];

    drawer.init = function(canvas){
        drawer.canvas = canvas;
        drawer.offsetTop = canvas.offsetTop;
        drawer.offsetLeft = canvas.offsetLeft;
        drawer.offsetRight = canvas.offsetRight;
        drawer.offsetBottom = canvas.offsetBottom;
        drawer.ctx = canvas.getContext("2d");
        drawer.height = canvas.height;
        drawer.width = canvas.width;
        GetHomeBack.Cursor.init();
    };

    drawer.start = function(){
        drawer.addZone(GetHomeBack.Zone(50, 50, "red"));
        drawer.addZone(GetHomeBack.Zone(200, 200, "blue"));
        drawer.draw();
    };

    drawer.globalToRelativeX = function(x){
        return x - drawer.offsetLeft;
    };

    drawer.globalToRelativeY = function(y){
        return y - drawer.offsetTop;
    };

    drawer.draw = function(){
        drawer.drawBackground();
        for(var i=0; i<drawer.drawables.length; i++){
            drawer.drawables[i].draw(drawer.ctx);
        }
    };

    drawer.drawBackground = function(){
        drawer.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        drawer.ctx.fillRect(0, 0, drawer.width, drawer.height);
    };

    drawer.addZone = function(zone){
        drawer.zones.push(zone);
        drawer.drawables = drawer.zones.concat(GetHomeBack.Cursor);
        return drawer;
    };

    drawer.getDrawable = function(x, y){
        for(var i=0; i<drawer.zones.length; i++){
            var zone = drawer.zones[i];
            if (zone.x < x &&
                zone.x + zone.dx > x &&
                zone.y < y &&
                zone.y + zone.dy > y)
                    return zone;
        }
        return null;
    };

    drawer.click = function(e){
        var selected = GetHomeBack.drawer.getDrawable(e.x, e.y);
        console.log(selected);
        if (selected) {
            old = selected.color;
            selected.color = "yellow";
            GetHomeBack.drawer.draw();
            selected.color = old;
        }
        return true;
    };

    return drawer;
})();
