app.controller("GUICtrl", ["$scope", "GUIMap", "GUISprites", "GUIZone", function ($scope, Map, Sprites, Zone) {
  "use strict";
  var Q = window.Q;

  $scope.gui.zoom = 48;
  $scope.gui.selectedZone = null;

  var drawer = {};

  function init (canvas) {
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

  function start(){
    redraw();
  }

  $scope.onZoomChange = function() {
    var centerX = (drawer.x + drawer.width/2) / Zone.getWidth();
    var centerY = (drawer.y + drawer.height/2) / Zone.getHeight();

    Zone.setSize($scope.gui.zoom, $scope.gui.zoom);

    drawer.x = centerX * Zone.getWidth() - drawer.width/2;
    drawer.y = centerY * Zone.getHeight() - drawer.height/2;

    redraw();
  };

  function globalToRelativeX(x){
    return x - drawer.bounding.left + drawer.x;
  }

  function globalToRelativeY(y){
    return y - drawer.bounding.top + drawer.y;
  }

  function redraw(){
    drawBackground();
    eachDrawables(function(d){
      d.draw(drawer.ctx, drawer.x, drawer.y);
    });
  }

  function drawBackground(){
    drawer.ctx.fillStyle = "rgb(0, 0, 0)";
    drawer.ctx.fillRect(0, 0, drawer.width, drawer.height);
  }

  function getDrawable(x, y){
    return Map.interpolateZone(x, y);
  }
  // TODO merge these 2 functions
  function eachDrawables(f){
    _.each(Map.getZones(), function (zone) {
      if (zone.isContained(drawer.x, drawer.y, drawer.width, drawer.height)) {
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

  function getGlobalX(e){
    return e.pageX + 1;
  }

  function getX(e){
    var x = getGlobalX(e);
    x = globalToRelativeX(x);
    return x;
  }

  function getGlobalY(e){
    return e.pageY + 1;
  }

  function getY(e){
    var y = getGlobalY(e);
    y = globalToRelativeY(y);
    return y;
  }

  function onMouseMove(e){
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
      redraw();
    }
  }

  function onMouseDown(e){
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
    }
    else {
      drawer.underMouse = underMouse;
    }
  }

  function onMouseUp(e){
    handlePointerEvent(e);
    drawer.whenSelected = null;
  }

  function onClick(e){
    handlePointerEvent(e);
    var res = true;
    if (drawer.movedWhenSelected) {
      // do nothing
    }
    else if (drawer.underMouse) {
      select(drawer.underMouse);
      res = drawer.underMouse.onClick(e);
    }
    redraw();
    drawer.movedWhenSelected = false;
    return res;
  }

  function eachSelected(func){
    for (var i in drawer.selected) {
      func(drawer.selected[i]);
    }
  }

  function select(arr){
    eachSelected(function(s){
      s.onUnSelected();
    });
    drawer.selected = arr.length ? arr : [arr];
    eachSelected(function(s){
      s.onSelected();
    });
    $scope.$apply( function() {
      $scope.gui.selectedZone = arr;
    });
  }

  init(Map.getCanvas(), Map.getOpts());

  Q.when(Map.isReady(), function(){
    start();
  });
}]);
