import {Router, State} from 'abyssa';
import Utils from './utils/utils.js';
import Signals from './signals.js';

const router = Router().configure({
  enableLogs: false,
  urlSync: 'hash',
  hashPrefix: '!'
});

const home = State('', {});

const base = State('base', {});

let lastMain = '/base';

const main = State('', {
  enter: function () {
    Signals.aside.opened.dispatch({position: 'left'});
    this.update();
  },
  update: function () {
    lastMain = router.path();
    console.log('lastMain', lastMain);
  },
  exit: function () {
    Signals.aside.closed.dispatch({position: 'left'});
  },
  base: base
});

const root = State('?right&bottom', {
  enter: function () {
    this.update();
  },
  update: function () {
    const paramsDiff = router.paramsDiff();

    if (paramsDiff.enter.right) {
      Signals.aside.opened.dispatch({position: 'right'});
    } else if (paramsDiff.exit.right) {
      Signals.aside.closed.dispatch({position: 'right'});
    }

    if (paramsDiff.enter.bottom) {
      Signals.aside.opened.dispatch({position: 'bottom'});
    } else if (paramsDiff.exit.bottom) {
      Signals.aside.closed.dispatch({position: 'bottom'});
    }
  },
  home: home,
  main: main
});

router.goToLastMain = function () {
  router.state(lastMain);
};

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
