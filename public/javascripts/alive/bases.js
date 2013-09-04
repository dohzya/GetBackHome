app.factory("Bases", [function () {
  function Base(args) {
    this.place = args.place;
    this.isPrimary = args.isPrimary || false;
    this.group = args.group;
  }

  return {
    create: function (args) { return new Base(args); }
  };
}]);