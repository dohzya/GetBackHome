app.factory("Group", ["Survivor", function (Survivor) {

  function Group(args) {
    this.survivors = args.survivors;
  }

  Group.prototype.killSurvivors = function(nb) {
    var survivors = [];
    for (var i=0; i<this.survivors.length-nb; i++) {
      survivors.push(this.survivors[i]);
    }
    this.survivors = survivors;
  };

  Group.prototype.defense = function() {
    var defense = 0;
    for (var i in this.survivors) {
      var survivor = this.survivors[i];
      defense += survivor.Defense();
    }
    return defense;
  };

  Group.prototype.attack = function() {
    var attack = 0;
    for (var i in this.survivors) {
      var survivor = this.survivors[i];
      attack += survivor.Attack();
    }
    return attack;
  };

  Group.prototype.tooling = function() {
    var attack = 0;
    for (var i in this.survivors) {
      var survivor = this.survivors[i];
      attack += survivor.tooling;
    }
    return attack;
  };

  Group.prototype.length = function() {
    return this.survivors.length;
  };

  Group.prototype.addSurvivors = function(nb) {
    var newSurvivors = Survivor.createSeveral(nb);
    for (var i in newSurvivors) {
      this.survivors.push(newSurvivors[i]);
    }
  };

  Group.prototype.removeSurvivors = function(nb) {
    for (var i=0; i<nb; i++) {
      this.survivors.pop();
    }
  };

  function create(args) {
    if (typeof(args) === "number") {
      return create({
        survivors: Survivor.createSeveral(args)
      });
    }
    else {
      return new Group(args);
    }
  }

  return {
    create: create
  };

}]);