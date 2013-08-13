var GetBackHome = (function () {
  "use strict";

  var GetBackHome = {};

  GetBackHome.init = function (canvas, status, opts, andThen) {
    GetBackHome.sprites.init(opts, function () {
      GetBackHome.status.init(status, opts);
      GetBackHome.game.init(opts);
      GetBackHome.opts = opts;
      andThen();
    });
  };

  GetBackHome.start = function (canvas, status, opts) {
    GetBackHome.init(canvas, status, opts, function () {
      GetBackHome.game.start();
    });
  };


  return GetBackHome;

})();
