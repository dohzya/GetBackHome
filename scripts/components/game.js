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
import SurvivorsDisplay from './survivorsDisplay.js';
import ButtonAction from './buttonAction.js';
import Map from '../map/map.js';
import Selection from '../user/selection.js';
import router from '../router.js';

const bottomSize = 150;

const actions = [
  { label: 'Next turn', icon: 'T', callback: ()=> console.log('Next turn') },
  { label: 'Create mission', icon: 'M', callback: ()=> console.log('Create mission') },
  { label: 'Do something fun', icon: 'F', callback: ()=> console.log('So much fun') }
];

export const Game = React.createClass({
  mixins: [CustomEventsMixin],

  getInitialState: function () {
    return {
      selection: Selection
    }
  },

  componentDidMount: function () {
    this.on('select', function (event) {
      switch (event.detail.type) {
        case 'tile':
          Selection.setTile(event.detail.value);
          break;
      }

      this.setState({selection: Selection})
    }.bind(this));

    this.on('block', function (event) {
      if (event.detail === 'asides') {
        this.refs.leftAside.block();
        this.refs.rightAside.block();
        this.refs.bottomAside.block();
      }
    }.bind(this));

    this.on('unblock', function (event) {
      if (event.detail === 'asides') {
        this.refs.leftAside.unblock();
        this.refs.rightAside.unblock();
        this.refs.bottomAside.unblock();
      }
    }.bind(this));

    router.transition.completed.add(function (s) {
      const paramsDiff = router.paramsDiff();

      if (paramsDiff.enter.right) {
        this.refs.rightAside.open();
      } else if (paramsDiff.exit.right) {
        this.refs.rightAside.close();
      }

      if (paramsDiff.enter.bottom) {
        this.refs.bottomAside.open();
      } else if (paramsDiff.exit.bottom) {
        this.refs.bottomAside.close();
      }
    }.bind(this));
  },

  onOpenAside: function (aside) {
    const search = {};
    search[aside.props.position] = 'default';
    router.search(search);
  },

  onCloseAside: function (aside) {
    const search = {};
    search[aside.props.position] = null;
    router.search(search);
  },

  render: function() {
    let bottom;

    if (this.state.selection.tile) {
      bottom = <TileDisplay tile={this.state.selection.tile} />
    }

    return (
      <div className="container">
        <Map game={this.props.game} selection={this.state.selection} bottom={bottomSize} />

        <Aside ref="bottomAside" position="bottom" overflow={bottomSize} grap={0} onOpen={this.onOpenAside} onClose={this.onCloseAside}>
          <a href="/">Home</a>
          <a href="/base">Base</a>
          {bottom}
        </Aside>

        <ButtonAction actions={actions} />

        <Aside ref="leftAside" position="left">
          Left
        </Aside>

        <Aside ref="rightAside" position="right" onOpen={this.onOpenAside} onClose={this.onCloseAside}>
          <SurvivorsDisplay survivors={this.props.game.player.primaryBase.survivors}/>
        </Aside>
      </div>
    );
  }
});
