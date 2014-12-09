(function () {
  if (!Math.sign) {
    Math.sign = function (number) {
      return number && number / Math.abs(number);
    };
  }
})();
