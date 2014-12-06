import * as React from 'react';

export default React.createClass({
  componentDidMount: function () { this.init(); },
  init: function () {
    this.canvas = document.getElementById('map');
    this.bounding = this.canvas.getBoundingClientRect();
    this.ctx = this.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.underMouse = null;
    this.selected = [];

    this.canvas.onclick = this.onClick;
    this.canvas.onmouseup = this.onMouseUp;
    this.canvas.onmousedown = this.onMouseDown;
    this.canvas.onmousemove = this.onMouseMove;

    this.draw();
  },
  draw: function () {
    console.log(this);
    console.log(this.props.tiles);

    let t = [];
    this.props.tiles.forEach(function (tile) {
      if (tile.zone.hexTile.isContained(this.x, this.y, this.width, this.height)) {
        t.push(tile);
        tile.draw(this.ctx, this.x, this.y);
      }
    }.bind(this));
    console.log(t.length);
  },
  render: function() {
    return (
      <canvas id="map" className="map" width="600px" height="500px"></canvas>
    );
  }
});
