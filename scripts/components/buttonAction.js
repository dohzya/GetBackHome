import * as React from 'react/addons';
import * as Hammer from 'hammerjs';
import Utils from '../utils/utils.js';
import CustomEventsMixin from '../mixins/customEventsMixin.js';

export default React.createClass({
  mixins: [CustomEventsMixin],

  getInitialState: function () {
    return {
      open: false,
      position: 'bottom right',
      progress: 0
    }
  },

  getDefaultProps: function () {
    return {
      actions: []
    }
  },

  componentDidMount: function () {
    const element = this.getDOMNode();

    this.elements = {
      main: element.querySelector('.button-main'),
      actions: element.querySelector('.actions'),
      mask: element.querySelector('.button-action-mask')
    };

    this.hammer = new Hammer(this.elements.main);
    this.hammer.on('tap', this.open);

    this.actionsHammer = new Hammer(this.elements.actions);
    this.actionsHammer.on('tap', function (e) {
      function getIndex(element) {
        if (!element) return null;
        const dataIndex = element && element.getAttribute('data-index');
        if (dataIndex) {
          return dataIndex;
        } else {
          return getIndex(element.parentNode);
        }
      }

      const index = getIndex(e.target);
      if (index) {
        const action = this.props.actions[parseInt(index, 10)];
        this.close();
        action.callback();
      }
    }.bind(this));

    this.maskHammer = new Hammer(this.elements.mask);
    this.maskHammer.on('tap', this.close);
  },

  render: function () {
    const classes = React.addons.classSet({
      'button-action': true,
      'is-open': this.state.open
    });

    const styles = {};
    const actionStyles = {}
    const maskStyles = {}

    this.state.position.split(' ').forEach(function (p) {
      styles[p] = 20;
      actionStyles[p] = 0;
    });

    actionStyles.opacity = this.state.progress;
    maskStyles.opacity = Math.min(0.6, this.state.progress);

    this.props.actions.forEach(function (action, index) {
      action.styles = {
        transform: 'translateY(-'+ (this.state.progress * index * 70) +'px) translateZ(0)'
      };

      Object.keys(actionStyles).forEach((key)=> action.styles[key] = actionStyles[key]);
    }.bind(this));

    const actions = this.props.actions.map(function (action, index) {
      return (
        <li className="action" style={action.styles} data-index={index}>
          <label className="label-action">{action.label}</label>
          <button type="button" className="button-secondary">{action.icon}</button>
        </li>
      )
    });

    return (
      <div className={classes}>
        <div className="button-action-mask" style={maskStyles}></div>
        <div className="button-action-wrapper" style={styles}>
          <button type="button" className="button-main">+</button>
          <ul className="actions no-style">
            {actions}
          </ul>
        </div>
      </div>
    );
  },

  open: function () {
    if (this.state.open) return;

    this.dispatch('block', 'asides');
    this.setState({open: true});

    Utils.animate.range({
      start: 0,
      end: 1,
      duration: 200,
      callback: function (progress) {
        this.setState({progress});
      }.bind(this),
      done: function (progress) {
        this.setState({progress});
        this.props.onOpen && this.props.onOpen();
      }.bind(this)
    });
  },

  close: function () {
    if (!this.state.open) return;

    Utils.animate.range({
      start: 1,
      end: 0,
      duration: 200,
      callback: function (progress) {
        this.setState({progress});
      }.bind(this),
      done: function (progress) {
        this.setState({open: false, progress});
        this.props.onClose && this.props.onClose();
        this.dispatch('unblock', 'asides');
      }.bind(this)
    });
  }
});
