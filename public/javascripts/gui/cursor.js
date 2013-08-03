GetBackHome.Cursor = (function(GetBackHome){
    "use strict";

    var cursor = {};

    cursor.init = function(drawer, opts){
        cursor.drawer = drawer;
        cursor.x = 100;
        cursor.y = 100;
        cursor.dx = 20;
        cursor.dy = 20;
        cursor.normal = GetBackHome.sprites("cursor");
        cursor.selected = GetBackHome.sprites("cursorSelected");
        cursor.mode = "normal";
    };

    cursor.start = function(){
        cursor.drawer.canvas.onmousemove = cursor.onMouseMove;
        cursor.drawer.canvas.onclick = cursor.onClick;
        cursor.drawer.canvas.onmousedown = cursor.onMouseDown;
        cursor.drawer.canvas.onmouseup = cursor.onMouseUp;
    };

    cursor.getGlobalX = function(e){
        return e.pageX + 1;
    };

    cursor.getX = function(e){
        var x = cursor.getGlobalX(e);
        x = cursor.drawer.globalToRelativeX(x);
        return x;
    };

    cursor.getGlobalY = function(e){
        return e.pageY + 1;
    };

    cursor.getY = function(e){
        var y = cursor.getGlobalY(e);
        y = cursor.drawer.globalToRelativeY(y);
        return y;
    };

    cursor.setXY = function(e){
        cursor.x = cursor.getX(e);
        cursor.y = cursor.getY(e);
        cursor.e = {
            globalX: cursor.getGlobalX(e),
            globalY: cursor.getGlobalY(e),
            x: cursor.x,
            y: cursor.y,
            drawer: cursor.drawer
        };
    };

    cursor.onMouseMove = function(e){
        cursor.setXY(e);
        cursor.drawer.onMouseMove(cursor.e);
        return true;
    };

    cursor.onMouseDown = function(e){
        cursor.mode = "selected";
        cursor.drawer.onMouseDown(cursor.e);
    };
    cursor.onMouseUp = function(e){
        cursor.mode = "normal";
        cursor.drawer.onMouseUp(cursor.e);
    };

    cursor.onClick = function(e){
        cursor.drawer.onClick(cursor.e);
    };

    cursor.draw = function(ctx, x, y){
        if (cursor.mode === "selected") {
            cursor.selected.draw(ctx, cursor.x-x, cursor.y-y);
        }
        else {
            cursor.normal.draw(ctx, cursor.x-x, cursor.y-y);
        }
    };

    return cursor;
})(GetBackHome);
