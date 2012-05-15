"use strict";

GetHomeBack.drawer = (function(){
    var drawer = {};

    drawer.init = function(canvas, opts){
        drawer.canvas = canvas;
        drawer.offsetTop = canvas.offsetTop;
        drawer.offsetLeft = canvas.offsetLeft;
        drawer.offsetRight = canvas.offsetRight;
        drawer.offsetBottom = canvas.offsetBottom;
        drawer.ctx = canvas.getContext("2d");
        drawer.x = 0;
        drawer.y = 0;
        drawer.height = canvas.height;
        drawer.width = canvas.width;
        drawer.drawables = [];
        drawer.zones = [];
        drawer.selected = null;
        GetHomeBack.Cursor.init(drawer, opts.cursor);
    };

    drawer.start = function(){
        drawer.redraw();
        GetHomeBack.Cursor.start();
    };

    drawer.globalToRelativeX = function(x){
        return x - drawer.offsetLeft + drawer.x;
    };

    drawer.globalToRelativeY = function(y){
        return y - drawer.offsetTop + drawer.y;
    };

    drawer.redraw = function(){
        drawer.drawBackground();
        for(var i in drawer.drawables) {
            drawer.drawables[i].draw(drawer.ctx, drawer.x, drawer.y);
        }
    };

    drawer.drawBackground = function(){
        drawer.ctx.fillStyle = "rgb(0, 0, 0)";
        drawer.ctx.fillRect(0, 0, drawer.width, drawer.height);
    };

    drawer.addZone = function(zone){
        drawer.zones.push(zone);
        drawer.drawables = drawer.zones.concat(GetHomeBack.Cursor);
        return drawer;
    };

    drawer.getDrawable = function(x, y){
        for(var i in drawer.zones) {
            var zone = drawer.zones[i];
            if (zone.x <= x &&
                zone.x + zone.dx >= x &&
                zone.y <= y &&
                zone.y + zone.dy >= y)
                    return zone;
        }
        return null;
    };

    drawer.onMouseMove = function(e){
        drawer.redraw();
    };

    drawer.onMouseDown = function(e){
        var selected = drawer.getDrawable(e.x, e.y);
        if (selected === drawer.selected) {
            // no nothing
        }
        else {
            if (drawer.selected) {
                drawer.selected.onUnSelected();
            }
            if (selected) {
                selected.onSelected();
            }
            drawer.selected = selected;
        }
    };

    drawer.onMouseUp = function(e){
    };

    drawer.onClick = function(e){
        var res = true;
        if(drawer.selected) {
            res = drawer.selected.onClick(e);
        }
        else {
            GetHomeBack.status.displayNothing();
        }
        drawer.redraw();
        return res;
    };

    return drawer;
})();
