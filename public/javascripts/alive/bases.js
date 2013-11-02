window.app.factory("Bases", ["Groups", function (Groups) {
  "use strict";

  function Base(args) {
    this.place = args.place;
    this.isPrimary = args.isPrimary || false;
    this.group = args.group;
  }

  Base.prototype.visit = function (turnNb) {
    this.group.visitPlace(turnNb, this.place);
  };

  Base.prototype.extractSurvivors = function (survivors) {
    survivors = _.isArray(survivors) ? survivors : Array.prototype.slice.call(arguments);

    _.forEach(survivors, function (survivor) {
      if (this.group.contains(survivor)) {
        this.group.remove(survivor);
      }
    }, this);

    return Groups.create({
      survivors: survivors
    });
  };

  Base.create = function (args) {
    return new Base(args);
  };

  return {
    create: Base.create
  };
}]);
