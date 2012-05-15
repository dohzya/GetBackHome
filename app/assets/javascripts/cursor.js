"use strict";

GetHomeBack.Cursor = (function(GetHomeBack){
    var cursor = {};

    cursor.init = function(drawer, opts){
        cursor.drawer = drawer;
        cursor.x = 100;
        cursor.y = 100;
        cursor.dx = 20;
        cursor.dy = 20;
        cursor.normal = new Image();
        cursor.normal.src = opts.normal;
        cursor.selected = new Image();
        cursor.selected.src = opts.selected;
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
        if (x < 0) x = 0;
        return x;
    };

    cursor.getGlobalY = function(e){
        return e.pageY + 1;
    };

    cursor.getY = function(e){
        var y = cursor.getGlobalY(e);
        y = cursor.drawer.globalToRelativeY(y);
        if (y < 0) y = 0;
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
        if (cursor.mode === "normal") {
            if (cursor.normal) {
                ctx.drawImage(cursor.normal, cursor.x-x, cursor.y-y);
            }
            else {
                ctx.fillStyle = "yellow";
                ctx.fillRect(cursor.x-x, cursor.y-y, cursor.dx, cursor.dy);
            }
        }
        else if (cursor.mode === "selected") {
            if (cursor.selected) {
                ctx.drawImage(cursor.selected, cursor.x-x, cursor.y-y);
            }
            else {
                ctx.fillStyle = "red";
                ctx.fillRect(cursor.x-x, cursor.y-y, cursor.dx, cursor.dy);
            }
        }
    };

    return cursor;
})(GetHomeBack);
