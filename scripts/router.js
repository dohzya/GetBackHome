import {Router, State} from 'abyssa';
import * as React from 'react';
import Utils from './utils/utils.js';
import Signals from './signals.js';

import SurvivorsDisplay from './components/survivorsDisplay.js';
import BaseDisplay from './components/baseDisplay.js';
import MissionsDisplay from './components/missionsDisplay.js';

const aside = {
  open: function (position) { Signals.aside.opened.dispatch({position}); },
  close: function (position) { Signals.aside.closed.dispatch({position}); },
  change: function (position, value) { Signals.aside.changed.dispatch({position, value}); }
};

const buttonAction = {
  open: function (position) { Signals.buttonAction.opened.dispatch(); },
  close: function (position) { Signals.buttonAction.closed.dispatch(); }
}

const last = {
  main: 'root.main.base',
  bis: 'default',
  ter: 'default'
};

const router = Router().configure({
  enableLogs: false,
  urlSync: 'hash',
  hashPrefix: '!'
});

router.transition.ended.add(function (state) {
  if (state.params.bis) {
    if (state.params.bis && state.params.bis !== 'default') {

    } else {
      aside.change('bis', <SurvivorsDisplay />);
    }

    last.bis = state.params.bis;
    aside.open('bis');
  } else {
    aside.close('bis');
  }

  if (state.params.ter) {
    last.ter = state.params.ter;
    aside.open('ter');
  } else {
    aside.close('ter');
  }

  if (state.params.action) {
    buttonAction.open('action');
  } else {
    buttonAction.close('action');
  }
});

const home = State('', {});

const base = State('base', {
  enter: ()=> aside.change('main', <BaseDisplay />)
});

const missions = State('', {
  enter: ()=> aside.change('main', <MissionsDisplay />)
});
const mission = State(':id', {});
const newMission = State('new', {});
const missionsParent = State('missions', { missions, mission, newMission });

const main = State('', {
  enter: function () {
    aside.open('main');
  },
  update: function () {},
  exit: function () {
    const previousState = router.previousState();
    last.main = previousState && previousState.state.fullName || last.main;
    console.log('last.main', last.main);
    aside.close('main');
  },
  base: base,
  missionsParent: missionsParent
});

const root = State('?bis&ter&action', {
  enter: function (params) {
    aside.change('bis', <SurvivorsDisplay />);
  },
  home: home,
  main: main
});

router.goTo = function (state, params) {
  params = params || {};
  const currentParams = router.params();
  if (currentParams.bis) {
    params.bis = currentParams.bis;
  }

  if (currentParams.ter) {
    params.ter = currentParams.ter;
  }

  router.state(state, params);
};

router.goToLast = function (aside) {
  if (aside === 'main' && !router.currentState().isIn('root.main')) {
    router.goTo(last.main);
  } else if (aside === 'bis') {
    router.search({bis: last.bis});
  } else if (aside === 'ter') {
    router.search({ter: last.main});
  }
};
    // console.log('updateParams', state.state.fullName, newParams);

router.updateCurrentParams = function (newParams) {
  const state = router.currentState();
  if (!Utils.is.equal(newParams, state.params)) {
    // Triple state!! (this is not a bug)
    router.state(state.state.fullName, newParams);
  }
};

router.search = function (query) {
  const params = Utils.clone(router.currentState().params);
  Object.keys(query).forEach(function (key) {
    if (query[key] === null) {
      delete params[key];
    } else {
      params[key] = query[key];
    }
  });
  router.updateCurrentParams(params);
};

router.addState('root', root).init();

export default router;
