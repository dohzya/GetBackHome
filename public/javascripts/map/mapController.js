app.controller("MapCtrl", ["$scope", "$rootScope", "Events", "Selection", "Sprites", "Places", "Zones", function ($scope, $rootScope, Events, Selection, Sprites, Places, Zones) {
  "use strict";
  var Q = window.Q;

  $scope.gui.zoom = 48;

  $scope.$on(Events.gui.draw, function () {
    draw();
  });

  var canvas = document.getElementById("map");
  var drawer = {};

  function init() {
    drawer.canvas = canvas;
    drawer.bounding = drawer.canvas.getBoundingClientRect();
    drawer.ctx = canvas.getContext("2d");
    drawer.x = 0;
    drawer.y = 0;
    drawer.height = canvas.height;
    drawer.width = canvas.width;
    drawer.underMouse = null;
    drawer.selected = [];

    canvas.onclick = onClick;
    canvas.onmouseup = onMouseUp;
    canvas.onmousedown = onMouseDown;
    canvas.onmousemove = onMouseMove;
  }

  function start() {
    draw();
  }

  $scope.onZoomChange = function () {
    var centerX = (drawer.x + drawer.width / 2) / $scope.gui.zoom;
    var centerY = (drawer.y + drawer.height / 2) / $scope.gui.zoom;

    Zones.setSize($scope.gui.zoom, $scope.gui.zoom);

    drawer.x = centerX * Zones.getWidth() - drawer.width / 2;
    drawer.y = centerY * Zones.getHeight() - drawer.height / 2;

    draw();
  };

  function globalToRelativeX(x) {
    return x - drawer.bounding.left + drawer.x;
  }

  function globalToRelativeY(y) {
    return y - drawer.bounding.top + drawer.y;
  }

  function draw() {
    drawBackground();
    eachDrawables(function (d) {
      d.draw(drawer.ctx, drawer.x, drawer.y);
    });
  }

  function drawBackground() {
    drawer.ctx.fillStyle = "rgb(0, 0, 0)";
    drawer.ctx.fillRect(0, 0, drawer.width, drawer.height);
  }

  function getDrawable(x, y) {
    return Zones.interpolate(x, y);
  }
  // TODO merge these 2 functions
  function eachDrawables(f) {
    _.forEach(Zones.all(), function (zone) {
      if (zone.place.tile.isContained(drawer.x, drawer.y, drawer.width, drawer.height)) {
        f(zone);
      }
    });
  }

  function handlePointerEvent(e) {
    e.globalX = getGlobalX(e);
    e.globalY = getGlobalY(e);
    e.localX = getX(e);
    e.localY = getY(e);
    return e;
  }

  function getGlobalX(e) {
    return e.pageX + 1;
  }

  function getX(e) {
    var x = getGlobalX(e);
    x = globalToRelativeX(x);
    return x;
  }

  function getGlobalY(e) {
    return e.pageY + 1;
  }

  function getY(e) {
    var y = getGlobalY(e);
    y = globalToRelativeY(y);
    return y;
  }

  function onMouseMove(e) {
    if (drawer.whenSelected) {
      handlePointerEvent(e);
      drawer.movedWhenSelected = true;
      var underMouse = drawer.whenSelected;
      var d = underMouse.drawer;
      var c = underMouse.cursor;
      var dx = e.globalX - c.x;
      var dy = e.globalY - c.y;
      drawer.x = d.x - dx;
      drawer.y = d.y - dy;
      draw();
    }
  }

  function onMouseDown(e) {
    handlePointerEvent(e);
    var underMouse = getDrawable(e.localX, e.localY);
    drawer.whenSelected = {
      drawer: {
        x: drawer.x,
        y: drawer.y
      },
      cursor: {
        x: e.globalX,
        y: e.globalY
      }
    };

    if (underMouse === drawer.underMouse) {
      // no nothing
    } else {
      drawer.underMouse = underMouse;
    }
  }

  function onMouseUp(e) {
    handlePointerEvent(e);
    drawer.whenSelected = null;
  }

  function onClick(e) {
    handlePointerEvent(e);
    var res = true;
    if (drawer.movedWhenSelected) {
      // do nothing
    } else if (drawer.underMouse) {
      select(drawer.underMouse);
      res = drawer.underMouse.onClick(e);
    }
    draw();
    drawer.movedWhenSelected = false;
    return res;
  }

  function select(zone) {
    $scope.$apply(function () {
      var fromPlace = $rootScope.newMission && $rootScope.newMission.hasOrders() ? _.last($rootScope.newMission.getAllOrders()).targetPlace() : $rootScope.selection.base.place;
      var path = fromPlace.pathTo(zone.place);

      Selection.selectPath(path);
      $scope.selection.zone = zone;

      $rootScope.$broadcast(Events.gui.zones.selected);
    });
  }

  init();

  Q.when(Zones.isReady(), function () {
    start();
  });
}]);
