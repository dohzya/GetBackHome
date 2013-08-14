window.app.factory("GBHModels", ["Group", "Mission", "Order", "Survivor", "Horde", "Zombie", "Env", "Place", "Player", "Time", "Memory", function (Group,   Mission,   Order,   Survivor,   Horde,   Zombie,   Env,   Place,   Player,   Time,   Memory) {
  "use strict";

  return {
    createGroup: Group.create,
    createMission: Mission.create,
    eachMission: Mission.each,
    removeMission: Mission.remove,
    createOrder: Order.create,
    createSurvivor: Survivor.create,
    createHorde: Horde.create,
    createZombie: Zombie.create,
    createEnv: Env.create,
    createPlace: Place.create,
    createPlayer: Player.create,
    createTime: Time.create,
    createMemory: Memory.create
  };

}]);
