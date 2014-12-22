import * as Reflux from 'reflux';

export class Survivor {
  constructor (args) {
    this.name = args.name || 'John';
    this.age = args.age || 28;
  }
};

export const SurvivorStore = Reflux.createStore({
  init: function () {
    this.listenToMany([]);

    this.survivors = [];
    for (let i = 0; i < 20; ++i) {
      this.survivors.push(new Survivor({name: 'John '+i}));
    }
    this.trigger(this.survivors);
  },
  all: function () {
    return this.survivors;
  },
  byId: function (id) {
    return this.survivors.reduce((res, s)=> res || (s.id === id && s), undefined);
  },
  onFilter: function () {
    this.trigger(this.survivors);
  }
});
