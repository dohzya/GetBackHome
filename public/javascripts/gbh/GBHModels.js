app.factory("GBHModels", ["Group", "Mission", "Order", "Survivor", "Horde", "Zombie", "Env", "Place", "Player",
  function (Group, Mission, Order, Survivor, Horde, Zombie, Env, Place, Player) {
  "use strict";
  
  /*
   * Time
   */
  function Time(args) {
    this.min = args.min;
    this.standard = args.standard;
  }
  Time.prototype.rand = function() {
    var r = random(50, 150);
    return Math.round(random(this.min, this.standard * r) / 100);
  };
  function createTime(args) {
    return new Time(args);
  }

  return {
    createGroup: Group.create,
    createMission: Mission.create,
    createOrder: Order.create,
    createSurvivor: Survivor.create,
    createHorde: Horde.create,
    createZombie: Zombie.create,
    createEnv: Env.create,
    createPlace: Place.create,
    createPlayer: Player.create,
    createTime: createTime
  };

}]);
