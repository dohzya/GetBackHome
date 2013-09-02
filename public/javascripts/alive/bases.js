app.factory("Bases", [function () {
  function Base(args) {
    this.place = args.place;
    this.isPrimary = args.isPrimary || false;
  }

  return {
    create: function (args) { return new Base(args); }
  };
}]);