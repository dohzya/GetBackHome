app.factory("Util", [function () {
  "use strict";

  function random(arg1, arg2) {
    var min, max;
    if (arguments.length > 0) {
      if (arguments.length === 1) {
        min = 0;
        max = arg1;
      } else {
        min = arg1;
        max = arg2;
      }
      return Math.floor((Math.random() * (max - min)) + min);
    }
    return Math.random();
  }

  function min0(nb) {
    return Math.max(0.00001, nb);
  }
  function max100(nb) {
    return Math.min(nb, 0.99999);
  }
  function minmax(nb) {
    return min0(max100(nb));
  }

  function noop() {}

  function positive(nb) {
    return Math.max(nb, 0);
  }
  function positiveFloor(nb) {
    return Math.floor(positive(nb));
  }

  function round(nb, digits) {
    var pow = Math.pow(10, digits || 0);
    return Math.round(nb * pow) / pow;
  }

  function to2digits(nb) {
    return round(nb, 2);
  }

  return {
    random: random,
    minmax: minmax,
    min0: min0,
    max100: max100,
    noop: noop,
    positive: positive,
    positiveFloor: positiveFloor,
    round: round,
    to2digits: to2digits
  };
}]);
