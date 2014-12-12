import Group from '../alive/group.js';

class Structure {
  constructor (name, zone) {
    this.name = name;
    this.zone = zone;
    if (zone) zone.structure = this;
  }
}

export class Forest extends Structure {
  constructor (zone) {
    super('forest', zone);
    this.color = '39, 174, 96';
  }
}

export class Mountain extends Structure {
  constructor (zone) {
    super('mountain', zone);
    this.color = '44, 62, 80';
  }
}

export class City extends Structure {
  constructor (zone) {
    super('city', zone);
    this.color = '142, 68, 173';
  }
}

export class Field extends Structure {
  constructor (zone) {
    super('field', zone);
    this.color = '211, 84, 0';
  }
}

export class Base extends Structure {
  constructor (args) {
    super('base', args.zone);
    this.color = '192, 57, 43';
    this.survivors = new Group({survivors: args.survivors});
  }
}
