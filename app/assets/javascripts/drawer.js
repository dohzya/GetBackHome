GetHomeBack.Cursor = (function(){
    var cursor = {};

    cursor.init = function(drawer){
        cursor.drawer = drawer;
        cursor.x = 100;
        cursor.y = 100;
        cursor.dx = 10;
        cursor.dy = 10;
        cursor.color = "yellow";
    };

    cursor.start = function(){
        cursor.drawer.canvas.onmousemove = cursor.onMouseMove;
        cursor.drawer.canvas.onclick = cursor.onClick;
    };

    cursor.getX = function(e){
        x = e.pageX - (cursor.dx/2);
        x = cursor.drawer.globalToRelativeX(x);
        if (x < 0) x = 0;
        return x;
    };

    cursor.getY = function(e){
        y = e.pageY - (cursor.dy/2);
        y = cursor.drawer.globalToRelativeY(y);
        if (y < 0) y = 0;
        return y;
    };

    cursor.setXY = function(e){
        cursor.x = cursor.getX(e);
        cursor.y = cursor.getY(e);
    };

    cursor.onMouseMove = function(e){
        cursor.setXY(e);
        cursor.drawer.redraw();
        return true;
    };

    cursor.onClick = function(e){
        cursor.setXY(e);
        return cursor.drawClick(function(){
            cursor.drawer.onClick({
                x: cursor.x,
                y: cursor.y,
                drawer: cursor.drawer
            });
        });
    };

    cursor.drawClick = function(f){
        var old, res;
        old = cursor.color;
        cursor.color = "red";
        cursor.drawer.redraw();
        res = f();
        cursor.color = old;
        return res;
    };

    cursor.draw = function(ctx){
        ctx.fillStyle = cursor.color;
        ctx.fillRect(cursor.x, cursor.y, cursor.dx, cursor.dy);
    };

    return cursor;
})();

GetHomeBack.drawer = (function(){
    var drawer = {};

    drawer.init = function(canvas){
        drawer.canvas = canvas;
        drawer.offsetTop = canvas.offsetTop;
        drawer.offsetLeft = canvas.offsetLeft;
        drawer.offsetRight = canvas.offsetRight;
        drawer.offsetBottom = canvas.offsetBottom;
        drawer.ctx = canvas.getContext("2d");
        drawer.height = canvas.height;
        drawer.width = canvas.width;
        drawer.drawables = [];
        drawer.zones = [];
        GetHomeBack.Cursor.init(drawer);
    };

    drawer.start = function(){
        drawer.redraw();
        GetHomeBack.Cursor.start();
    };

    drawer.globalToRelativeX = function(x){
        return x - drawer.offsetLeft;
    };

    drawer.globalToRelativeY = function(y){
        return y - drawer.offsetTop;
    };

    drawer.redraw = function(){
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

    drawer.onClick = function(e){
        var selected = drawer.getDrawable(e.x, e.y);
        var res = selected ? selected.onClick(e) : true;
        return res;
    };

    return drawer;
})();
