'use strict';

class Biome {
  constructor (name) {
    this.name = name;
  }
}

class Plain extends Biome {
  constructor () {
    super('plain');
    this.color = '127, 168, 79';
  }
}

class Water extends Biome {
  constructor () {
    super('water');
    this.color = '127, 169, 181';
  }
}

class Mountainous extends Biome {
  constructor () {
    super('mountainous');
    this.color = '127, 127, 127';
  }
}

class Desert extends Biome {
  constructor () {
    super('desert');
    this.color = '105, 74, 68';
  }
}

export default {
  plain: new Plain(),
  water: new Water(),
  mountainous: new Mountainous(),
  desert: new Desert()
}
