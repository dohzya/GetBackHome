"use strict";

var GetHomeBack = (function(){
    var GetHomeBack = {};

    GetHomeBack.init = function(canvas, status, opts){
        GetHomeBack.drawer.init(canvas, opts);
        GetHomeBack.status.init(status, opts);
        GetHomeBack.game.init(opts);
        GetHomeBack.opts = opts;
        if (opts.zones) GetHomeBack.addZones(opts.zones);
    };

    GetHomeBack.start = function(){
        GetHomeBack.game.start();
    };

    GetHomeBack.addZones = function(zones){
        for(var i in zones){
            GetHomeBack.drawer.addZone(GetHomeBack.Zone(zones[i], GetHomeBack.opts));
        }
    };

    return GetHomeBack;

})();
