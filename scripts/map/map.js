import * as React from 'react/addons';
import * as Reflux from 'reflux';
import * as Hammer from 'hammerjs';
import CustomEventsMixin from '../mixins/customEventsMixin.js';
import World from './world.js';
import Actions from '../actions.js';
import Selection from '../user/selection.js';

export default React.createClass({
  mixins: [CustomEventsMixin, Reflux.listenTo(Selection, 'onSelectionChange')],

  getDefaultProps: function () {
    return {
      bottom: 0
    };
  },

  componentDidMount: function () {
    this.init();
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
  },

  render: function() {
    return (
      <div className="main map">
        <canvas id="map" width="600px" height="500px"></canvas>
      </div>
    );
  },

  init: function () {
    this.canvas = document.getElementById('map');
    this.bounding = this.canvas.getBoundingClientRect();
    this.ctx = this.canvas.getContext("2d");

    const bounding = this.getDOMNode().getBoundingClientRect();
    this.lastWidth = bounding.width;
    this.lastHeight = (bounding.height - this.props.bottom);
    this.x = -this.lastWidth / 2;
    this.y = -this.lastHeight / 2;
    this.underMouse = null;
    this.selected = [];

    this.hammer = new Hammer(this.getDOMNode());
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    this.hammer.on('panstart', this.onStart);
    this.hammer.on('panend', this.onEnd);
    this.hammer.on('pancancel', this.onEnd);
    this.hammer.on('panmove', this.onMove);
    this.hammer.on('tap', this.onTap);

    this.handleResize();
  },

  handleResize: function (e) {
    const bounding = this.getDOMNode().getBoundingClientRect();
    this.width = this.canvas.width = bounding.width;
    this.height = this.canvas.height = (bounding.height - this.props.bottom);
    this.bounding = this.canvas.getBoundingClientRect();

    this.x = this.x + (this.lastWidth - this.width) / 2;
    this.y = this.y + (this.lastHeight - this.height) / 2;

    this.lastWidth = this.width;
    this.lastHeight = this.lastHeight;
    this.draw();
  },

  drawBackground: function () {
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  },

  draw: function () {
    this.drawBackground();
    World.tiles.forEach(function (tile) {
      if (tile.isContained(this.x, this.y, this.width, this.height)) {
        tile.draw(this.ctx, this.x, this.y);
      }
    }.bind(this));
    Selection.draw(this.ctx, this.x, this.y);
  },

  globalToRelativeX: function (x) {
    return x - this.bounding.left + this.x;
  },

  globalToRelativeY: function (y) {
    return y - this.bounding.top + this.y;
  },

  handlePointerEvent: function (e) {
    e.globalX = this.getGlobalX(e);
    e.globalY = this.getGlobalY(e);
    e.localX = this.getX(e);
    e.localY = this.getY(e);
    return e;
  },

  getGlobalX: function (e) {
    return (e.pageX || e.center.x) + 1;
  },

  getX: function (e) {
    return this.globalToRelativeX(this.getGlobalX(e));
  },

  getGlobalY: function (e) {
    return (e.pageY || e.center.y) + 1;
  },

  getY: function (e) {
    return this.globalToRelativeY(this.getGlobalY(e));
  },

  getDrawable: function (x, y) {
    return World.interpolate(x, y);
  },

  onStart: function (e) {
    this.handlePointerEvent(e);
    this.startPosition = {
      drawer: {
        x: this.x,
        y: this.y
      },
      cursor: {
        x: e.globalX,
        y: e.globalY
      }
    };
  },

  onMove: function (e) {
    if (this.startPosition) {
      this.handlePointerEvent(e);
      const underMouse = this.startPosition;
      const d = underMouse.drawer;
      const c = underMouse.cursor;
      const dx = e.globalX - c.x;
      const dy = e.globalY - c.y;
      this.x = d.x - dx;
      this.y = d.y - dy;
      this.draw();
    }
  },

  onEnd: function (e) {
    this.handlePointerEvent(e);
    this.startPosition = null;
  },

  onTap: function (e) {
    this.handlePointerEvent(e);
    Actions.tileSelect(this.getDrawable(e.localX, e.localY));
  },

  onSelectionChange: function () {
    this.draw();
  }
});
