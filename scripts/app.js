console.print = function (...args) {
  args.forEach(function (arg) {
    console.log(JSON.stringify(arg));
  });
};

import * as React from 'react/addons';
import * as Velocity from 'velocity-animate';

import './polyfills/polyfills.js';

import {Game} from './components/game.js';

React.initializeTouchEvents(true);

React.render(
  <Game />,
  document.body
);
