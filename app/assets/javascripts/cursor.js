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
