app.controller("GUICtrl", ["$scope", "GUIMap", "GUISprites", "GUIZone", function ($scope, Map, Sprites, Zone) {
  "use strict";

  var drawer = {};
  $scope.zoom = 48;
  $scope.selectedZones = [];

  function init (canvas, opts){
    drawer.canvas = canvas;
    drawer.offsetTop = canvas.offsetTop;
    drawer.offsetLeft = canvas.offsetLeft;
    drawer.offsetRight = canvas.offsetRight;
    drawer.offsetBottom = canvas.offsetBottom;
    drawer.ctx = canvas.getContext("2d");
    drawer.x = 0;
    drawer.y = 0;
    drawer.height = canvas.height;
    drawer.width = canvas.width;
    drawer.underMouse = null;
    drawer.selected = [];
    
    canvas.onclick = drawer.onClick;
    canvas.onmouseup = drawer.onMouseUp;
    canvas.onmousedown = drawer.onMouseDown;
    canvas.onmousemove = drawer.onMouseMove;
  };

  drawer.start = function(){
    drawer.redraw();
  };

  $scope.onZoomChange = function(coeff) {
    console.log($scope.zoom);

    var centerX = (drawer.x + drawer.width/2) / Zone.getWidth();
    var centerY = (drawer.y + drawer.height/2) / Zone.getHeight();

    Zone.setSize($scope.zoom, $scope.zoom);

    drawer.x = centerX * Zone.getWidth() - drawer.width/2;
    drawer.y = centerY * Zone.getHeight() - drawer.height/2;

    drawer.redraw();
  };

  drawer.globalToRelativeX = function(x){
    return x - drawer.offsetLeft + drawer.x;
  };

  drawer.globalToRelativeY = function(y){
    return y - drawer.offsetTop + drawer.y;
  };

  drawer.redraw = function(){
    drawer.drawBackground();
    drawer.eachDrawables(function(d){
        d.draw(drawer.ctx, drawer.x, drawer.y);
    });
  };

  drawer.drawBackground = function(){
    drawer.ctx.fillStyle = "rgb(0, 0, 0)";
    drawer.ctx.fillRect(0, 0, drawer.width, drawer.height);
  };

  drawer.getDrawable = function(x, y){
      return Map.interpolateZone(x, y);
  };
  // TODO merge these 2 functions
  drawer.eachDrawables = function(f){
      _.each(Map.getZones(), function (zone) {
        if (zone.isContained(drawer.x, drawer.y, drawer.width, drawer.height)) {
          f(zone);
        }
      });
  };

  function handlePointerEvent(e) {
    e.globalX = getGlobalX(e);
    e.globalY = getGlobalY(e);
    e.localX = getX(e);
    e.localY = getY(e);
    return e;
  }

  function getGlobalX(e){
      return e.pageX + 1;
  };

  function getX(e){
      var x = getGlobalX(e);
      x = drawer.globalToRelativeX(x);
      return x;
  };

  function getGlobalY(e){
      return e.pageY + 1;
  };

  function getY(e){
      var y = getGlobalY(e);
      y = drawer.globalToRelativeY(y);
      return y;
  };

  drawer.onMouseMove = function(e){
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
      drawer.redraw();
    }
  };

  drawer.onMouseDown = function(e){
    handlePointerEvent(e);
    var underMouse = drawer.getDrawable(e.localX, e.localY);
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
  };

  drawer.onMouseUp = function(e){
    handlePointerEvent(e);
    drawer.whenSelected = null;
  };

  drawer.onClick = function(e){
    handlePointerEvent(e);
    var res = true;
    if (drawer.movedWhenSelected) {
      // do nothing
    }
    else if (drawer.underMouse) {
      drawer.select(drawer.underMouse);
      res = drawer.underMouse.onClick(e);
    }
    drawer.redraw();
    drawer.movedWhenSelected = false;
    return res;
  };

  drawer.eachSelected = function(func){
      for (var i in this.selected) {
          func(this.selected[i]);
      }
  };

  drawer.select = function(arr){
      this.eachSelected(function(s){
          s.onUnSelected();
      });
      this.selected = arr.length ? arr : [arr];
      this.eachSelected(function(s){
          s.onSelected();
      });
      $scope.$apply( function() {
        $scope.selectedZones = arr.length ? arr : [arr];
      });
  };

  init(Map.getCanvas(), Map.getOpts());

  Q.when(Map.isReady(), function () {
    drawer.start();
  });
}])