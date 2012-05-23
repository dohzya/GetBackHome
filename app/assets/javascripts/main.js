var GetHomeBack = (function(){
    "use strict";

    var GetHomeBack = {};

    GetHomeBack.init = function(canvas, status, opts, andThen){
        GetHomeBack.sprites.init(opts, function(){
            GetHomeBack.drawer.init(canvas, opts);
            GetHomeBack.status.init(status, opts);
            GetHomeBack.game.init(opts);
            GetHomeBack.opts = opts;
            if (opts.zones) GetHomeBack.addZones(opts.zones);
            andThen();
        });
    };

    GetHomeBack.start = function(canvas, status, opts){
        GetHomeBack.init(canvas, status, opts, function(){
            GetHomeBack.game.start();
        });
    };

    GetHomeBack.addZones = function(zones){
        for(var i in zones){
            GetHomeBack.drawer.addZone(GetHomeBack.Zone(zones[i], GetHomeBack.opts));
        }
    };

    return GetHomeBack;

})();
