import * as React from 'react';
import {Game} from './components/game.js';
import World from './map/world.js';

const world = new World();

console.log(world);

React.render(
  <Game world={world} />,
  document.body
);
