class Config {
  constructor (size) {
    this._size = size;
    this.update();
  }

  update () {
    this.height = 2 * this._size;
    this.width = Math.sqrt(3) * this._size;
  }

  size (s) {
    if (s) {
      this._size = size;
      this.update();
    } else {
      return this._size;
    }
  }

}

const config = new Config(30);

export default config;
