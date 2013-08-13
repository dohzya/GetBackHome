app.factory("Survivor", [function () {
  "use strict";

  function Survivor(args) {
    this.food = args.food;
    this.fighting = args.fighting;
    this.tooling = args.tooling;
    this.level = args.level;
    this.xp = args.xp;
    this.health = args.health;
    this.currentHealth = args.currentHealth;
    this.mental = args.mental;
    this.currentMental = args.currentMental;
  }

  Survivor.prototype.defense = function () {
    return this.fighting.defense;
  };

  Survivor.prototype.attack = function () {
    return this.fighting.attack;
  };

  Survivor.prototype.addXp = function (xp) {
    this.xp += xp;
    if (this.xp > Math.pow(2, this.level)) {
      this.level++;
      this.health += 0.2;
      this.mental += 0.2;
    }
  };

  function create(args) {
    return new Survivor(args);
  }

  function createSeveral(nb) {
    var survivors = [], i;
    for (i = 0; i < nb; i++) {
      survivors.push(create({
        food: 30,
        fighting: {
          attack: 10,
          defense: 15
        },
        tooling: 0.5,
        level: 1,
        xp: 0,
        health: 1,
        currentHealth: 0.5,
        mental: 1,
        currentMental: 0.5
      }));
    }
    return survivors;
  }

  return {
    create: create,
    createSeveral: createSeveral
  };

}]);

