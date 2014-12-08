// TODO: use and export ES6 class
// export class Game {
//   render () {
//     return (
//       <div className="game">Get Back Home</div>
//     )
//   }
// }

import * as React from 'react/addons';
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
        this.setState({aside: {right: true}});
      } else if (event.detail === 'left') {
        this.setState({aside: {left: true}});
      }
    }.bind(this));

    this.on('close', function (event, data) {
      if (event.detail === 'right') {
        this.setState({aside: {right: false}});
      } else if (event.detail === 'left') {
        this.setState({aside: {left: false}});
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
        <aside className="left">Left</aside>
        <Map world={this.props.world} />
        <aside className="right">Right</aside>
      </div>
    );
  }
});
