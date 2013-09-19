window.app.factory("Bases", [function () {
  "use strict";

  function Base(args) {
    this.place = args.place;
    this.isPrimary = args.isPrimary || false;
    this.group = args.group;
  }

  Base.prototype.visit = function (turnNb) {
    this.group.visitPlace(turnNb, this.place);
  };

  return {
    create: function (args) { return new Base(args); }
  };
}]);
