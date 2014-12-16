import * as Immutable from 'immutable';
import Utils from '../utils/utils.js';
import Group from './group.js';

class MissionStep {
  constructor (args) {
    this.zone = args.zone || throw new Error('Mission step: you need to specify where the step takes places')
    this.order = args.order || throw new Error('Mission step: you need to specify which order to execute');
    this.data = args.data || {};
    this.done = false;
  }
}

export default class Mission {
  constructor (args) {
    this.survivors = new Group({survivors: args.survivors});
    this.steps = Immutable.List([]);
    this.zone = args.zone;
    this.from = args.from || throw new Error('Mission: must have a starting base');
    this.to = args.to || this.from;
  }

  addStep (args) {
    this.steps = this.steps.push(new MissionStep(args));
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

  isMoving () {
    if (!this.zone) throw new Error('Mission: no zone found, the mission is nowhere!!')
    return !this.zone.equals(this.currentStep().zone);
  }

  hasStarted () {
    return !this.zone.equals(this.from.zone) || this.isDone();
  }

  isDone () {
    return this.steps.reduce((res, step)=> res && step.done, true) && this.zone.equals(this.to.zone);
  }

  pathTo (zone) {
    return this.zone.tile.pathTo(zone.tile);
  }

  currentPath () {
    return this.pathTo(this.currentStep().zone);
  }

  fullPath () {
    let lastStep;
    const fullPath = this.steps.reduce(function (path, step) {
      fullPath.concat(this.pathTo(step.zone));
    }.bind(this), this.from.zone);
  }
}
