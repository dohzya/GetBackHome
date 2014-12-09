import * as React from 'react/addons';
import * as Velocity from 'velocity-animate';

import './polyfills/polyfills.js';

import {Game} from './components/game.js';
import World from './map/world.js';

const world = new World();

console.log(world);

React.initializeTouchEvents(true);

React.render(
  <Game world={world} />,
  document.body
);
