"use strict";

GetHomeBack.Cursor = (function(){
    var cursor = {};

    cursor.init = function(drawer, opts){
        cursor.drawer = drawer;
        cursor.x = 100;
        cursor.y = 100;
        cursor.dx = 20;
        cursor.dy = 20;
        cursor.normal = opts.normal;
        cursor.selected = opts.selected;
        cursor.mode = "normal";
    };

    cursor.start = function(){
        cursor.drawer.canvas.onmousemove = cursor.onMouseMove;
        cursor.drawer.canvas.onclick = cursor.onClick;
    };

    cursor.getX = function(e){
        var x = e.pageX + 1;
        x = cursor.drawer.globalToRelativeX(x);
        if (x < 0) x = 0;
        return x;
    };

    cursor.getY = function(e){
        var y = e.pageY + 1;
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
        var res;
        cursor.mode = "selected";
        cursor.drawer.redraw();
        res = f();
        cursor.mode = "normal";
        return res;
    };

    cursor.draw = function(ctx){
        if (cursor.mode === "normal") {
            if (cursor.normal) {
                ctx.drawImage(cursor.normal, cursor.x, cursor.y);
            }
            else {
                ctx.fillStyle = "yellow";
                ctx.fillRect(cursor.x, cursor.y, cursor.dx, cursor.dy);
            }
        }
        else if (cursor.mode === "selected") {
            if (cursor.selected) {
                ctx.drawImage(cursor.selected, cursor.x, cursor.y);
            }
            else {
                ctx.fillStyle = "red";
                ctx.fillRect(cursor.x, cursor.y, cursor.dx, cursor.dy);
            }
        }
    };

    return cursor;
})();
