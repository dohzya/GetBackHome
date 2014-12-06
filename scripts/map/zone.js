import HexJs from '../hexjs/hexjs.js';
import World from './world.js';

export default class Zone {
  constructor (args) {
    args = args || {};
    this.x = args.x;
    this.y = args.y;
    this.z = args.z || 0;
    this.biome = args.biome;
    this.structure = args.structure;
    this.memory = {};
    this.missions = [];
    this.hexTile = HexJs.tile(this.x, this.y, 0);
  }

  memoryItem (ts) {
    return this.memory[ts];
  }

  endTurn (ts) {
    // TODO save new memory only if a group saved it
    this.memory[ts] = MemoryItems.create(ts, this);
  }

  defense (value) {
    if (value) { this.fighting.defense = value; }
    return this.fighting.defense;
  }

  addDefense (value) {
    return this.defense(this.defense() + value);
  }

  attack () {
    return this.fighting.attack;
  }

  infection () {
    var l = this.horde.length();
    return parseInt(Math.min(999.99, l) / 10, 10);
  }

  distanceTo (zone) {
    return this.hexTile.distanceTo(zone.hexTile);
  }

  costTo () {
    return 10;
  }

  neighbors () {
    return World.neighbors(this);
  }

  pathTo (destination) {
    return HexJs.findWith.astar(this, destination, Config.hexjs);
  }

  addMission (mission) {
    this.missions = _.union(this.missions, [mission]);
  }

  removeMission (mission) {
    this.missions = _.without(this.missions, mission);
  }

  groups () {
    var groups = [];
    this.missions.forEach(function (mission) { groups.push(mission.group); });
    Players.bases.forEach(function (base) { groups.push(base.group); });
    return groups;
  }
}
