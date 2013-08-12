app.factory("Horde", ["Zombie", function (Zombie) {

  function Horde(args) {
    this.zombies = args.zombies;
  }

  Horde.prototype.killZombies = function(nb) {
    var zombies = [];
    for (var i=0; i<this.zombies.length-nb; i++) {
      zombies.push(this.zombies[i]);
    }
    this.zombies = zombies;
  };

  Horde.prototype.defense = function() {
    var defense = 0;
    for (var i in this.zombies) {
      var zombie = this.zombies[i];
      defense += zombie.defense();
    }
    return defense;
  };

  Horde.prototype.attack = function() {
    var attack = 0;
    for (var i in this.zombies) {
      var zombie = this.zombies[i];
      attack += zombie.attack();
    }
    return attack;
  };

  Horde.prototype.length = function() {
    return this.zombies.length;
  };

  Horde.prototype.addZombies = function(nb) {
    var newZombies = Zombie.createSeveral(nb);
    for (var i in newZombies) {
      this.zombies.push(newZombies[i]);
    }
  };

  Horde.prototype.removeZombies = function(nb) {
    for (var i=0; i<nb; i++) {
      this.zombies.pop();
    }
  };

  function create(args) {
    if (typeof(args) === "number") {
      return create({
        zombies: Zombie.createSeveral(args)
      });
    }
    else {
      return new Horde(args);
    }
  }

  return {
    create: create
  };

}]);