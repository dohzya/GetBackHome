var GetHomeBack = (function(){
    var GetHomeBack = {};

    GetHomeBack.init = function(canvas){
        GetHomeBack.drawer.init(canvas);
        GetHomeBack.game.init();
    };

    GetHomeBack.start = function(){
        GetHomeBack.drawer.addZone(GetHomeBack.Zone(50, 50, "red"));
        GetHomeBack.drawer.addZone(GetHomeBack.Zone(200, 200, "blue"));
        GetHomeBack.game.start();
    };

    return GetHomeBack;

})();
