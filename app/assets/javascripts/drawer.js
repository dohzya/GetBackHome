GetHomeBack.drawer = (function(GetHomeBack){
    "use strict";

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
        drawer.zones = [];
        drawer.underMouse = null;
        drawer.selected = [];
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
        drawer.eachDrawables(function(d){
            d.draw(drawer.ctx, drawer.x, drawer.y);
        });
    };

    drawer.drawBackground = function(){
        drawer.ctx.fillStyle = "rgb(0, 0, 0)";
        drawer.ctx.fillRect(0, 0, drawer.width, drawer.height);
    };

    drawer.addZone = function(zone){
        drawer.zones.push(zone);
        return drawer;
    };

    drawer.getDrawable = function(x, y){
        for(var i in drawer.zones) {
            var zone = drawer.zones[i];
            if (zone.contains(x, y))
                    return zone;
        }
        return null;
    };
    // TODO merge these 2 functions
    drawer.eachDrawables = function(f){
        var res = [];
        var x1 = drawer.x;
        var x2 = x1 + drawer.width;
        var y1 = drawer.y;
        var y2 = y1 + drawer.height;
        for(var i in drawer.zones) {
            var zone = drawer.zones[i];
            if (zone.isContained(drawer.x, drawer.y, drawer.width, drawer.height))
                f(zone);
        }
        f(GetHomeBack.Cursor);
    };

    drawer.onMouseMove = function(e){
        if (drawer.whenSelected) {
            drawer.movedWhenSelected = true;
            var underMouse = drawer.whenSelected;
            var d = underMouse.drawer;
            var c = underMouse.cursor;
            var dx = e.globalX - c.x;
            var dy = e.globalY - c.y;
            drawer.x = d.x - dx;
            drawer.y = d.y - dy;
        }
        drawer.redraw();
    };

    drawer.onMouseDown = function(e){
        var underMouse = drawer.getDrawable(e.x, e.y);
        drawer.whenSelected = {
            drawer: {
                x: drawer.x,
                y: drawer.y
            },
            cursor: {
                x: e.globalX,
                y: e.globalY
            }
        };
        if (underMouse === drawer.underMouse) {
            // no nothing
        }
        else {
            drawer.underMouse = underMouse;
        }
    };

    drawer.onMouseUp = function(e){
        drawer.whenSelected = null;
    };

    drawer.onClick = function(e){
        var res = true;
        if (drawer.movedWhenSelected) {
            // do nothing
        }
        else if (drawer.underMouse) {
            drawer.select(drawer.underMouse);
            drawer.underMouse.display(GetHomeBack.status);
            res = drawer.underMouse.onClick(e);
        }
        else {
            GetHomeBack.status.displayNothing();
        }
        drawer.redraw();
        drawer.movedWhenSelected = false;
        return res;
    };

    drawer.eachSelected = function(func){
        for (var i in this.selected) {
            func(this.selected[i]);
        }
    };

    drawer.select = function(arr){
        this.eachSelected(function(s){
            s.onUnSelected();
        });
        this.selected = arr.length ? arr : [arr];
        this.eachSelected(function(s){
            s.onSelected();
        });
    };

    return drawer;
})(GetHomeBack);
