app.factory("GBHModels", ["Group", "Mission", "Order", "Survivor", "Horde", "Zombie", "Env", "Place", "Player", "Time", function (Group, Mission, Order, Survivor, Horde, Zombie, Env, Place, Player, Time) {
  "use strict";

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
    createTime: Time.create
  };

}]);
