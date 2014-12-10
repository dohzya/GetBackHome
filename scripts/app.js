console.print = function (...args) {
  args.forEach(function (arg) {
    console.log(JSON.stringify(arg));
  });
};

import * as React from 'react/addons';
import * as Velocity from 'velocity-animate';

import './polyfills/polyfills.js';

import {Game} from './components/game.js';
import World from './map/world.js';
import Player from './user/player.js';
import {Base} from './map/structures.js';

const game = {};

game.world = new World();
game.player = new Player();

const primaryBase = new Base(game.world.interpolate(0, 0).zone);
game.player.primaryBase = primaryBase;
game.player.bases.push(primaryBase);

console.log(game);

React.initializeTouchEvents(true);

React.render(
  <Game game={game} />,
  document.body
);
