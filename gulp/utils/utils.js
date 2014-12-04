regexJs = /js$/;

module.exports = {
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  },
  is: {
    js: function (file) {
      return regexJs.test(file.path);
    },
    changed: function (file) {
      return 'changed' === file.event;
    }
  }
};
