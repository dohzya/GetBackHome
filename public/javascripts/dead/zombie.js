app.factory("Zombie", [function () {
  "use strict";

  function Zombie(args) {
    this.fighting = args.fighting;
    this.affut = args.affut;
    this.excitation = args.excitation;
    this.state = args.state;
  }

  Zombie.prototype.defense = function () {
    return this.fighting.defense;
  };

  Zombie.prototype.attack = function () {
    return this.fighting.attack;
  };

  function create(args) {
    return new Zombie(args);
  }

  function createSeveral(nb) {
    var zombies = [], i;
    for (i = 0; i < nb; i++) {
      zombies.push(create({
        fighting: {
          attack: 5,
          defense: 5
        },
        affut: 0.5,
        excitation: 0.5,
        state: 0.5
      }));
    }
    return zombies;
  }

  return {
    create: create,
    createSeveral: createSeveral
  };

}]);
