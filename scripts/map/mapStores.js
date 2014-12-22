import * as Reflux from 'reflux';
import World from '../map/world.js';
import {BaseActions} from '../actions.js';

export const BaseStore = Reflux.createStore({
  init: function () {
    this.listenToMany(BaseActions);

    this.base = new Base({
      zone: World.interpolate(0, 0).zone,
      survivors: []
    });

    this.trigger(this.base);
  },
  onBaseSetSurvivors: function (survivors) {
    this.base.survivors.add(survivors);
    this.trigger(this.base);
  }
});
