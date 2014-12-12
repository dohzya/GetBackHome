import * as Immutable from 'immutable';

export default class Group {
  constructor (args) {
    this.survivors = Immutable.Set(args.survivors || []);
  }

  size () {
    return this.survivors.size;
  }

  add (...survivors) {
    this.survivors = this.survivors.withMutations(function (s) {
      s.push.apply(s, survivors);
    });
  }

  remove (...survivors) {
    survivors.forEach(function (s) {
      this.survivors = this.survivors.delete(s);
    });
  }

  has (...survivors) {
    return survivors.reduce(function (acc, value) {
      return acc || this.survivors.has(value);
    }, true);
  }

  forEach () {
    this.survivors.forEach.apply(this.survivors, arguments);
  }

  map () {
    try {
      return this.survivors.map.apply(this.survivors, arguments);
    } catch (e) {
      const s = this.survivors.toArray();
      return s.map.apply(s, arguments);
    }
  }

  // TODO: gameplay stuff (speed, attack, defense, ...)
}
