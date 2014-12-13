import * as Signals from 'signals';

const Signal = Signals.Signal;

export default {
  aside: {
    opened: new Signal(),
    closed: new Signal()
  }
}
