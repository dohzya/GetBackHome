app.factory("Hordes", ["Zombies", function (Zombies) {

  function Horde(args) {
    this.zombies = args.zombies;
  }

  Horde.prototype.killZombies = function (nb) {
    var zombies = [], i;
    for (i = 0; i < this.zombies.length - nb; i++) {
      zombies.push(this.zombies[i]);
    }
    this.zombies = zombies;
  };

  Horde.prototype.defense = function () {
    var defense = 0, i, zombie;
    for (i in this.zombies) {
      zombie = this.zombies[i];
      defense += zombie.defense();
    }
    return defense;
  };

  Horde.prototype.attack = function () {
    var attack = 0, i, zombie;
    for (i in this.zombies) {
      zombie = this.zombies[i];
      attack += zombie.attack();
    }
    return attack;
  };

  Horde.prototype.length = function () {
    return this.zombies.length;
  };

  Horde.prototype.addZombies = function (nb) {
    var newZombies = Zombies.createSeveral(nb), i;
    for (i in newZombies) {
      this.zombies.push(newZombies[i]);
    }
  };

  Horde.prototype.removeZombies = function (nb) {
    var i;
    for (i = 0; i < nb; i++) {
      this.zombies.pop();
    }
  };

  Horde.create = function (args) {
    if (typeof args === "number") {
      return Horde.create({
        zombies: Zombies.createSeveral(args)
      });
    }
    return new Horde(args);
  };

  return {
    create: Horde.create
  };

}]);
