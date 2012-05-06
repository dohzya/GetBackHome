var GetHomeBack = (function(){
    var GetHomeBack = {};

    GetHomeBack.init = function(canvas, status){
        GetHomeBack.drawer.init(canvas);
        GetHomeBack.status.init(status);
        GetHomeBack.game.init();
    };

    GetHomeBack.start = function(){
        GetHomeBack.drawer.addZone(GetHomeBack.Zone({
            x: 50,
            y: 50,
            dx: 50,
            dy: 50,
            color: "red",
            infos: {"Type": "montains"}
        }));
        GetHomeBack.drawer.addZone(GetHomeBack.Zone({
            x: 200,
            y: 200,
            dx: 50,
            dy: 50,
            color: "blue",
            infos: {"Type": "city"}
        }));
        GetHomeBack.game.start();
    };

    return GetHomeBack;

})();
