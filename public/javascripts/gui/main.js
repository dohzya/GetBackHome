var GetBackHome = (function(){
    "use strict";

    var GetBackHome = {};

    GetBackHome.init = function(canvas, status, opts, andThen){
        GetBackHome.sprites.init(opts, function(){
            GetBackHome.drawer.init(canvas, opts);
            GetBackHome.status.init(status, opts);
            GetBackHome.game.init(opts);
            GetBackHome.opts = opts;
            if (opts.zones) GetBackHome.addZones(opts.zones);
            andThen();
        });
    };

    GetBackHome.start = function(canvas, status, opts){
        GetBackHome.init(canvas, status, opts, function(){
            GetBackHome.game.start();
        });
    };

    GetBackHome.addZones = function(zones){
        for(var i in zones){
            GetBackHome.drawer.addZone(GetBackHome.Zone(zones[i], GetBackHome.opts));
        }
    };

    return GetBackHome;

})();
