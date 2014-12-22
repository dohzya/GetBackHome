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
import Router from '../router.js';
import Signals from '../signals.js';
import TileDisplay from './tileDisplay.js';
import SurvivorsDisplay from './survivorsDisplay.js';
import BaseDisplay from './baseDisplay.js';
import ButtonAction from './buttonAction.js';
import Map from '../map/map.js';
import Selection from '../user/selection.js';
import Mission from '../alive/mission.js';
import Actions from '../actions.js';
import World from '../map/world.js';

const bottomSize = 150;

const actions = [
  { label: 'Next turn', icon: 'T', callback: ()=> console.log('Next turn') },
  { label: 'Create mission', icon: 'M', callback: function () {
    const newMission = new Mission(World.zoneAt(0, 0));
    Actions.missionSelect(newMission);
  } },
  { label: 'Do something fun', icon: 'F', callback: ()=> console.log('So much fun') }
];

export const Game = React.createClass({
  mixins: [CustomEventsMixin],

  getInitialState: function () {
    return {
      selection: Selection,
      aside: {}
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
        this.refs.mainAside.block();
        this.refs.bisAside.block();
        this.refs.terAside.block();
      }
    }.bind(this));

    this.on('unblock', function (event) {
      if (event.detail === 'asides') {
        this.refs.mainAside.unblock();
        this.refs.bisAside.unblock();
        this.refs.terAside.unblock();
      }
    }.bind(this));

    Signals.aside.opened.add(function (e) {
      this.refs[e.position+'Aside'].open();
    }.bind(this));

    Signals.aside.closed.add(function (e) {
      this.refs[e.position+'Aside'].close();
    }.bind(this));

    Signals.aside.changed.add(function (e) {
      const newState = {aside: this.state.aside};
      newState.aside[e.position] = e.value;
      this.setState(newState);
    }.bind(this));

    Signals.buttonAction.opened.add(function (e) {
      this.refs.buttonAction.open();
    }.bind(this));

    Signals.buttonAction.closed.add(function (e) {
      this.refs.buttonAction.close();
    }.bind(this));
  },

  onOpenAside: function (aside) {
    Router.goToLast(aside.props.role);
  },

  onCloseAside: function (aside) {
    const search = {};
    search[aside.props.role] = null;
    Router.search(search);
  },

  onOpenMainAside: function (aside) {
    Router.goToLast('main');
  },

  onCloseMainAside: function (aside) {
    Router.goTo('root.home');
  },

  onOpenButtonAction: function () {
    Router.search({action: 'default'});
  },

  onCloseButtonAction: function () {
    Router.search({action: null});
  },

  render: function() {
    let bottom;

    if (this.state.selection.tile) {
      bottom = <TileDisplay tile={this.state.selection.tile} />
    }

    return (
      <div className="container">
        <Map selection={this.state.selection} bottom={bottomSize} />

        <Aside ref="terAside" role="ter" position="bottom" overflow={bottomSize} grap={0} onOpen={this.onOpenAside} onClose={this.onCloseAside}>
          <a href="/">Home</a>
          <a href="/base">Base</a>
          <a href="/missions">Missions</a>
          {bottom}
        </Aside>

        <ButtonAction ref="buttonAction" actions={actions} onOpen={this.onOpenButtonAction} onClose={this.onCloseButtonAction} />

        <Aside ref="mainAside" role="main" position="left" onOpen={this.onOpenMainAside} onClose={this.onCloseMainAside}>
          {this.state.aside.main}
        </Aside>

        <Aside ref="bisAside" role="bis" position="right" onOpen={this.onOpenAside} onClose={this.onCloseAside}>
          {this.state.aside.bis}
        </Aside>
      </div>
    );
  }
});
