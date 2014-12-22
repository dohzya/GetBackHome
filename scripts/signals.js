import * as Signals from 'signals';

const Signal = Signals.Signal;

export default {
  aside: {
    opened: new Signal(),
    closed: new Signal(),
    changed: new Signal()
  },
  buttonAction: {
    opened: new Signal(),
    closed: new Signal()
  }
}
