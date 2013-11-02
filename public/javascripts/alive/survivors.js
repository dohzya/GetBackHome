app.factory("Survivors", [function () {
  "use strict";

  function Survivor(args) {
    // Personal infos
    this.name = args.name;
    this.avatar = args.avatar;
    this.age = args.age;
    this.gender = args.gender;
    this.mass = args.mass;
    this.height = args.height;
    this.description = args.description;

    // Attributes
    this.strength = args.strength;
    this.constitution = args.constitution;
    this.agility = args.agility;
    this.perception = args.perception;
    this.intelligence = args.intelligence;
    this.charisma = args.charisma;

    // Evolution
    this.level = args.level || 1;
    this.xp = args.xp || 0;

    // Traits
    this.health = args.health || this.maxHealth();
    this.mental = args.mental || this.maxMental();
    this.endurance = args.endurance || this.maxEndurance();
    this.hunger = args.hunger || this.maxHunger();
  }

  Survivor.prototype.isMale = function () {
    return this.gender;
  };

  Survivor.prototype.maxHealth = function () {
    return this.level + this.strength;
  };

  Survivor.prototype.percentHealth = function () {
    return this.health / this.maxHealth();
  };

  Survivor.prototype.maxMental = function () {
    return this.level + this.intelligence;
  };

  Survivor.prototype.percentMental = function () {
    return this.mental / this.maxMental();
  };

  Survivor.prototype.maxEndurance = function () {
    return this.level + 2 * this.constitution;
  };

  Survivor.prototype.percentEndurance = function () {
    return this.endurance / this.maxEndurance();
  };

  Survivor.prototype.maxHunger = function () {
    return 100;
  };

  Survivor.prototype.percentHunger = function () {
    return this.hunger / this.maxHunger();
  };

  Survivor.prototype.defense = function () {
    return this.level + this.constitution + this.perception;
  };

  Survivor.prototype.attack = function () {
    return this.level + this.strength + this.agility;
  };

  Survivor.prototype.levelToString = function () {
    if (this.level < 10) {
      return 'Amateur';
    } else if (this.level < 20) {
      return 'Quite good';
    } else {
      return 'Zombie killer';
    }
  };

  Survivor.prototype.addXp = function (xp) {
    this.xp += xp;
    if (this.xp > Math.pow(2, this.level)) {
      this.level++;
      this.health += 0.2;
      this.mental += 0.2;
    }
  };

  Survivor.create = function (args) {
    return new Survivor(args);
  };

  var boyNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", "Paul", "Mark", "Donald"];
  var girlNames = ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen"];

  Survivor.createSeveral = function (nb) {
    var survivors = [], i;
    for (i = 0; i < nb; i++) {
      var gender = _.random(1) === 1;
      survivors.push(create({
        name: gender ? boyNames[_.random(boyNames.length-1)] : girlNames[_.random(girlNames.length-1)],
        avatar: "",
        age: _.random(10, 60),
        gender: gender,
        mass: _.random(50, 130),
        height: _.random(160, 200),
        description: 'Lorem ipsum',
        strength: _.random(5, 30),
        constitution: _.random(5, 30),
        agility: _.random(5, 30),
        perception: _.random(5, 30),
        intelligence: _.random(5, 30),
        charisma: _.random(5, 30)
      }));
    }
    return survivors;
  };

  return {
    create: Survivor.create,
    createSeveral: Survivor.createSeveral
  };

}]);

