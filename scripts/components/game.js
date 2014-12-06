// TODO: use and export ES6 class
// export class Game {
//   render () {
//     return (
//       <div className="game">Get Back Home</div>
//     )
//   }
// }

import * as React from 'react';
import Map from '../map/map.js';

export const Game = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="game">Get Back Home</h1>
        <Map tiles={this.props.world.tiles} />
      </div>
    );
  }
});
