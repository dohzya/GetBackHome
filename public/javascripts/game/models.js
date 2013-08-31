window.app.factory("Models", ["Group", "Mission", "Missions", "Order", "Survivor", "Horde", "Zombie", "Env", "Place", "Map", "Player", "Time", "Memory",
    function (Group, Mission, Missions, Order, Survivor, Horde, Zombie, Env, Place, Map, Player, Time, Memory) {
  "use strict";

  return {
    createGroup: Group.create,
    createMission: Mission.create,
    eachMission: Missions.each,
    removeMission: Missions.remove,
    createOrder: Order.create,
    createSurvivor: Survivor.create,
    createHorde: Horde.create,
    createZombie: Zombie.create,
    createEnv: Env.create,
    createPlace: Place.create,
    createPlayer: Player.create,
    getPlace: Map.getPlace,
    getCenterPlace: Map.getCenterPlace,
    createTime: Time.create,
    createMemory: Memory.create
  };

}]);
