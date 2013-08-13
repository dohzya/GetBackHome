GetBackHome.status = (function ($) {
  "use strict";

  var status = {};

  status.init = function (containers) {
    status.selected = $(containers.selected);
    status.selectedTitle = $(status.selected.find(".title")[0]);
    status.selectedFields = $(status.selected.find(".fields")[0]);
    status.displayNothing();
  };

  status.displayZone = function (zone) {
    var div = $.el.div(), key;
    for (key in zone.infos) {
      div.appendChild($.el.dl(
        $.el.dt(key),
        $.el.dd(zone.infos[key])
      ));
    }
    status.displaySelected("Zone", div);
  };

  status.displaySelected = function (name, div) {
    status.selectedTitle.empty();
    status.selectedTitle.append(name);
    status.selectedFields.empty();
    status.selectedFields.append(div);
  };

  status.displayNothing = function (name, div) {
    status.selectedTitle.empty();
    status.selectedTitle.append("Selection");
    status.selectedFields.empty();
  };


  return status;
})(jQuery);
