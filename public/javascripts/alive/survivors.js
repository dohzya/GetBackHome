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

    // Attributes
    this.strength = args.strength;
    this.constitution = args.constitution;
    this.agility = args.agility;
    this.perception = args.perception;
    this.intelligence = args.intelligence;
    this.charisma = args.charisma;

    // Traits
    this.health = this.maxHealth();
    this.mental = this.maxMental();
    this.endurance = this.maxEndurance();

    // Evolution
    this.level = args.level || 1;
    this.xp = args.xp || 0;
  }

  Survivor.prototype.isMale = function () {
    return this.gender;
  };

  Survivor.prototype.maxHealth = function () {
    return this.level + this.strength;
  };

  Survivor.prototype.maxMental = function () {
    return this.level + this.intelligence;
  };

  Survivor.prototype.maxEndurance = function () {
    return this.level + 2 * this.constitution;
  };

  Survivor.prototype.defense = function () {
    return this.level + this.constitution + this.perception;
  };

  Survivor.prototype.attack = function () {
    return this.level + this.strength + this.agility;
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

  var boyNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", "Paul", "Mark", "Donald"];
  var girlNames = ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen"];

  function createSeveral(nb) {
    var survivors = [], i;
    for (i = 0; i < nb; i++) {
      var gender = _.random(1) == 1;
      survivors.push(create({
        name: gender ? boyNames[_.random(boyNames.length-1)] : girlNames[_.random(girlNames.length-1)],
        avatar: "",
        age: _.random(10, 60),
        gender: gender,
        mass: _.random(50, 130),
        height: _.random(160, 200),
        strength: _.random(5, 30),
        constitution: _.random(5, 30),
        agility: _.random(5, 30),
        perception: _.random(5, 30),
        intelligence: _.random(5, 30),
        charisma: _.random(5, 30)
      }));
    }
    return survivors;
  }

  return {
    create: create,
    createSeveral: createSeveral
  };

}]);

