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
        var selected, res;
        selected = drawer.getDrawable(e.x, e.y);
        if(selected){
            res = selected.onClick(e);
        }
        else {
            res = true;
            GetHomeBack.status.displayNothing();
        }
        return res;
    };

    return drawer;
})();
