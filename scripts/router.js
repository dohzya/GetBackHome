import {Router, State} from 'abyssa';
import Utils from './utils/utils.js';

const home = State('', {});

const base = State('base', {});

const root = State('?right&bottom', {
  home: home,
  base: base
});

const router = Router().configure({
  enableLogs: false,
  urlSync: true,
  hashPrefix: '!'
});

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
