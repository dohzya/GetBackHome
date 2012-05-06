var GetHomeBack = (function(){
    var GetHomeBack = {};

    GetHomeBack.init = function(canvas, status){
        GetHomeBack.drawer.init(canvas);
        GetHomeBack.status.init(status);
        GetHomeBack.game.init();
    };

    GetHomeBack.start = function(){

        GetHomeBack.game.start();
    };

    GetHomeBack.addZones = function(zones){
        for(var i in zones){
            GetHomeBack.drawer.addZone(GetHomeBack.Zone(zones[i]));
        }
    };

    return GetHomeBack;

})();
