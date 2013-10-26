app.service("Rc4Random", [function () {
  "use strict";

  function rc4RandomGen(seed) {
    var keySchedule = [];
    var keyScheduleI = 0;
    var keyScheduleJ = 0;

    function init(seed) {
      var i;
      for (i = 0; i < 256; i++) {
        keySchedule[i] = i;
      }

      var j = 0, t;
      for (i = 0; i < 256; i++) {
        j = (j + keySchedule[i] + seed.charCodeAt(i % seed.length)) % 256;

        t = keySchedule[i];
        keySchedule[i] = keySchedule[j];
        keySchedule[j] = t;
      }
    }
    init(seed);

    function getRandomByte() {
      keyScheduleI = (keyScheduleI + 1) % 256;
      keyScheduleJ = (keyScheduleJ + keySchedule[keyScheduleI]) % 256;

      var t = keySchedule[keyScheduleI];
      keySchedule[keyScheduleI] = keySchedule[keyScheduleJ];
      keySchedule[keyScheduleJ] = t;

      return keySchedule[(keySchedule[keyScheduleI] + keySchedule[keyScheduleJ]) % 256];
    }

    return {
      getRandomNumber: function () {
        var number = 0;
        var multiplier = 1;
        var i;
        for (i = 0; i < 8; i++) {
          number += getRandomByte() * multiplier;
          multiplier *= 256;
        }
        return number / 18446744073709551616;
      }
    };

  }

  var rc4Random = null;

  function genSeed() {
    var seed = "",
      chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      i;
    for (i = 0; i < 30; i++) {
      seed += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return seed;
  }

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
      return Math.floor((rc4Random.getRandomNumber() * (max - min)) + min);
    }
    return rc4Random.getRandomNumber();
  }

  return {
    init: function (seed) { rc4Random = rc4RandomGen(seed || genSeed()); },
    random: random
  };

}]);
