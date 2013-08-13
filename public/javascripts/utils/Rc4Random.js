app.service("Rc4Random", [function () {
  "use strict";

  function Rc4Random(seed) {
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

  return {
    create: Rc4Random
  };

}]);
