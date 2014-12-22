import * as Reflux from 'reflux';
import Actions from '../actions.js';
import World from '../map/world.js';

export default Reflux.createStore({
  init: function () {
    this.listenToMany(Actions);

    this.tile = undefined;
    this.path = [];
    this.survivors = [];
    this.mission = undefined;
    this.order = undefined;
  },

  draw: function (ctx, x, y) {
    this.tile && this.tile.draw(ctx, x, y, this);
    this.path.forEach(function (tile) {
      tile.draw(ctx, x, y, this);
    }.bind(this));
  },

  updatePath: function () {
    if (this.mission && this.tile) {
      this.path = this.mission.fullPath().concat(this.mission.lastStep().pathTo(this.tile));
    } else if (this.mission) {
      this.path = this.mission.fullPath();
    } else if (this.tile) {
      this.path = World.at(0, 0).pathTo(this.tile);
    }
  },

  onTileSelect: function (tile) {
    this.tile = tile;
    this.updatePath();
    this.trigger(this);
  },

  onTileUnselect: function () {
    this.tile = null;
    this.updatePath();
    this.trigger(this);
  },

  onSurvivorSelect: function (survivor) {
    this.survivors.push(survivor);
    this.trigger(this);
  },

  onMissionSelect: function () {
    this.mission = mission;
    this.updatePath();
    this.tigger(this);
  },

  onMissionUnselect: function () {
    this.mission = null;
    this.updatePath();
    this.tigger(this);
  }
});
