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
import Survivor from './alive/survivor.js';

const game = {};

game.world = new World();
game.player = new Player();

const survivors = [];
for (let i = 0; i < 20; ++i) {
  survivors.push(new Survivor({name: 'John '+i}));
}

const primaryBase = new Base({
  zone: game.world.interpolate(0, 0).zone,
  survivors: survivors
});

game.player.primaryBase = primaryBase;
game.player.bases.push(primaryBase);

console.log(game);

React.initializeTouchEvents(true);

React.render(
  <Game game={game} />,
  document.body
);
