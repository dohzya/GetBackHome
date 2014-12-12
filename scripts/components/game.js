// TODO: use and export ES6 class
// export class Game {
//   render () {
//     return (
//       <div className="game">Get Back Home</div>
//     )
//   }
// }

import * as React from 'react/addons';
import CustomEventsMixin from '../mixins/customEventsMixin.js';
import Aside from './aside.js';
import TileDisplay from './tileDisplay.js';
import Map from '../map/map.js';
import Selection from '../user/selection.js';

const bottomSize = 150;

export const Game = React.createClass({
  mixins: [CustomEventsMixin],

  getInitialState: function () {
    return {
      selection: Selection
    }
  },

  componentDidMount: function () {
    this.on('open', function (event) {
      if (event.detail === 'right') {
        this.refs.asideRight.open();
      } else if (event.detail === 'left') {
        this.refs.asideLeft.open();
      }
    }.bind(this));

    this.on('close', function (event) {
      if (event.detail === 'right') {
        this.refs.asideRight.close();
      } else if (event.detail === 'left') {
        this.refs.asideLeft.close();
      }
    }.bind(this));

    this.on('select', function (event) {
      switch (event.detail.type) {
        case 'tile':
          Selection.setTile(event.detail.value);
          break;
      }

      this.setState({selection: Selection})
    }.bind(this));
  },

  render: function() {
    let bottom;

    if (this.state.selection.tile) {
      bottom = <TileDisplay tile={this.state.selection.tile} />
    }

    return (
      <div className="container">
        <Map game={this.props.game} selection={this.state.selection} bottom={bottomSize} />
        <Aside ref="asideBottom" position="bottom" overflow={bottomSize} grap={0}>
          {bottom}
        </Aside>
        <Aside ref="asideLeft" position="left">Left</Aside>
        <Aside ref="asideRight" position="right">Right</Aside>
      </div>
    );
  }
});
