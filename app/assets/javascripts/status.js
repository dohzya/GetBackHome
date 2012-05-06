GetHomeBack.status = (function(){
    var status = {};

    status.init = function(containers){
        status.selected = $(containers.selected);
        status.selectedTitle = $(status.selected.find(".title")[0]);
        status.selectedFields = $(status.selected.find(".fields")[0]);
    };

    status.displayZone = function(zone){
        var div = $.el.div();
        for (var key in zone.infos) {
            div.appendChild($.el.dl(
                $.el.dt(key),
                $.el.dd(zone.infos[key])
            ));
        }
        status.displaySelected("Zone", div);
    };

    status.displaySelected = function(name, div){
        console.log(status.selectedTitle.html());
        status.selectedTitle.empty(); // empty && add title && div
        status.selectedTitle.append(name);
        status.selectedFields.empty();
        status.selectedFields.append(div);
    };

    return status;
})();
