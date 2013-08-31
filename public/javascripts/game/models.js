window.app.factory("Models", ["Groups", "Missions", "Orders", "Survivors", "Hordes", "Zombies", "Env", "Places", "Map", "Players", "Times", "Memories",
    function (Groups, Missions, Orders, Survivors, Hordes, Zombies, Env, Places, Map, Players, Times, Memories) {
  "use strict";

  return {
    createGroup: Groups.create,
    createMission: Missions.create,
    eachMission: Missions.each,
    removeMission: Missions.remove,
    createOrder: Orders.create,
    createSurvivor: Survivors.create,
    createHorde: Hordes.create,
    createZombie: Zombies.create,
    createEnv: Env.create,
    createPlace: Places.create,
    createPlayer: Players.create,
    getPlace: Map.getPlace,
    getCenterPlace: Map.getCenterPlace,
    createTime: Times.create,
    createMemory: Memories.create
  };

}]);
