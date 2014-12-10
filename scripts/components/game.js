// TODO: use and export ES6 class
// export class Game {
//   render () {
//     return (
//       <div className="game">Get Back Home</div>
//     )
//   }
// }

import * as React from 'react/addons';
import Aside from './aside.js';
import Map from '../map/map.js';
import CustomEventsMixin from '../mixins/customEventsMixin.js';

export const Game = React.createClass({
  mixins: [CustomEventsMixin],

  getInitialState: function () {
    return {
      aside: {
        left: false,
        right: false
      }
    }
  },

  componentDidMount: function () {
    this.on('open', function (event, data) {
      if (event.detail === 'right') {
        this.refs.asideRight.open();
      } else if (event.detail === 'left') {
        this.refs.asideLeft.open();
      }
    }.bind(this));

    this.on('close', function (event, data) {
      if (event.detail === 'right') {
        this.refs.asideRight.close();
      } else if (event.detail === 'left') {
        this.refs.asideLeft.close();
      }
    }.bind(this));
  },

  render: function() {
    const classes = React.addons.classSet({
      'container': true,
      'with-left': this.state.aside.left,
      'with-right': this.state.aside.right
    });

    return (
      <div className={classes}>
        <Map game={this.props.game} />
        <Aside ref="asideLeft" position="left">Left</Aside>
        <Aside ref="asideRight" position="right">Right</Aside>
      </div>
    );
  }
});
