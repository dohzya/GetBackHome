import * as Immutable from 'immutable';
import Utils from '../utils/utils.js';
import World from '../map/world.js';
import Group from './group.js';

class MissionStep {
  constructor (args) {
    if (!args.zone) throw new Error('Mission step: you need to specify where the step takes places')
    if (!args.order) throw new Error('Mission step: you need to specify which order to execute');
    this.zone = args.zone;
    this.order = args.order;
    this.data = args.data || {};
    this.done = false;
  }
}

export default class Mission {
  constructor (args) {
    if (!args.from) throw new Error('Mission: must have a starting base');
    this.survivors = new Group({survivors: args.survivors});
    this.steps = Immutable.List([]);
    this.zone = args.zone;
    this.from = args.from;
    this.to = args.to || this.from;
  }

  addStep (args) {
    this.steps = this.steps.push(args instanceof MissionStep ? args : new MissionStep(args));
  }

  removeStep (value) {
    if (Utils.is.number(value)) {
      this.steps = this.steps.delete(value);
    } else {
      this.removeStep(this.steps.indexOf(value));
    }
  }

  currentStep () {
    return this.steps.reduce((res, step)=> !res && !step.done ? step : res, null);
  }

  firstStep () {
    return this.steps.first();
  }

  lastStep () {
    return this.steps.last();
  }

  isMoving () {
    if (!this.zone) throw new Error('Mission: no zone found, the mission is nowhere!!')
    return !this.zone.equals(this.currentStep().zone);
  }

  hasStarted () {
    return !this.zone.equals(this.from) || this.isDone();
  }

  isDone () {
    return this.steps.reduce((res, step)=> res && step.done, true) && this.zone.equals(this.to.zone);
  }

  pathTo (zone) {
    return World.at(this.zone).pathTo(World.at(zone));
  }

  currentPath () {
    return this.pathTo(this.currentStep().zone);
  }

  fullPath () {
    const {path, tile} = this.steps.reduce(function (acc, step) {
      const nextTile = World.at(step.zone);
      acc.path.concat(acc.tile.pathTo(nextTile));
      acc.tile = nextTile;
    }.bind(this), {path: [], tile: World.at(this.from)});

    return path;
  }
}
