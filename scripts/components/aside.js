import * as React from 'react';
import * as Hammer from 'hammerjs';
import Utils from '../utils/utils.js';

export default React.createClass({

  getInitialState: function () {
    return {
      open: false,
      moving: false,
      translateX: 0,
      translateY: 0
    }
  },

  getDefaultProps: function () {
    return {
      position: 'right',
      grap: 25,
      velocity: 0.65,
      duration: 500,
      size: '80%',
      zZndex: 1,
      opacity: 250,
      overflow: 0
    }
  },

  componentWillMount: function () {
    this.is = {
      right: this.props.position === 'right',
      left: this.props.position === 'left',
      top: this.props.position === 'top',
      bottom: this.props.position === 'bottom'
    };

    this.is.horizontal = this.is.right || this.is.left;
    this.is.vertical = this.is.top || this.is.bottom;

    if (this.is.right) {
      this.movingBorder = 'left';
    }
    else if (this.is.left) {
      this.movingBorder = 'right';
    }
    else if (this.is.top) {
      this.movingBorder = 'bottom';
    }
    else if (this.is.bottom) {
      this.movingBorder = 'top';
    }
  },

  componentDidMount: function () {
    this.aside = this.getDOMNode().querySelector('.aside');
    this.mask = this.getDOMNode().querySelector('.aside-mask');
    this.bounding = this.aside.getBoundingClientRect();

    window.addEventListener('resize', this.handleResize);

    this.hammer = new Hammer(this.getDOMNode());
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    this.hammer.on('panstart', this.onStart);
    this.hammer.on('panend', this.onEnd);
    this.hammer.on('panmove', this.onMove);

    this.maskHammer = new Hammer(this.mask);
    this.maskHammer.on('tap', this.close);

    // We couldn't fully render the component during the 1st render because
    // we needed the DOM element to measure some dimensions. In order to solve
    // that, we will force a new render after the component has been mounted.
    if (this.props.overflow) this.forceUpdate();
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
  },

  handleResize: function () {
    this.bounding = this.aside.getBoundingClientRect();

    if (this.state.moving) {
      this.cancel();
    }
  },

  getOpacity: function (isMask) {
    if (this.state.open || (this.props.overflow && !isMask)) {
      return 1;
    } else if (this.state.moving) {
      return Math.min(1, Math.max(Math.abs(this.state.translateX), Math.abs(this.state.translateY)) / this.props.opacity);
    } else {
      return 0;
    }
  },

  getTranslateX: function (e) {
    let nextTranslate, nextMovingBorder;

    if (e) {
      // We have an event -> we are moving
      nextTranslate = (this.kickoff && this.kickoff.translate.x || 0) + (e.deltaX || 0);

      if (this.kickoff) {
        nextMovingBorder = this.kickoff.limits[this.props.position] + nextTranslate;

        if (nextMovingBorder < this.kickoff.limits.left) {
          nextTranslate = this.kickoff.limits.left - this.kickoff.limits[this.props.position];
        } else if (nextMovingBorder > this.kickoff.limits.right) {
          nextTranslate = this.kickoff.limits.right - this.kickoff.limits[this.props.position];
        }
      }
    } else {
      // No event? Meaning we are on a final position (either closed or opened)
      nextTranslate = this.getStartX();
    }

    return nextTranslate;
  },

  getTranslateY: function (e) {
    let nextTranslate, nextMovingBorder;

    if (e) {
      // We have an event -> we are moving
      nextTranslate = (this.kickoff && this.kickoff.translate.y || 0) + (e.deltaY || 0);

      if (this.kickoff) {
        nextMovingBorder = this.kickoff.limits[this.props.position] + nextTranslate;

        if (nextMovingBorder < this.kickoff.limits.top) {
          nextTranslate = this.kickoff.limits.top - this.kickoff.limits[this.props.position];
        } else if (nextMovingBorder > this.kickoff.limits.bottom) {
          nextTranslate = this.kickoff.limits.bottom - this.kickoff.limits[this.props.position];
        }
      }
    } else {
      // No event? Meaning we are on a final position (either closed or opened)
      nextTranslate = this.getStartY();
    }

    return nextTranslate;
  },

  getFinalX: function (opening) {
    return opening ? (this.is.right ? -1 : 1) * (this.bounding.width - this.props.overflow) : 0;
  },

  getFinalY: function (opening) {
    return opening ? (this.is.bottom ? -1 : 1) * (this.bounding.height - this.props.overflow) : 0;
  },

  getStartX: function () {
    return this.state.open ? (this.is.right ? -1 : 1) * (this.bounding.width - this.props.overflow) : 0;
  },

  getStartY: function () {
    return this.state.open ? (this.is.bottom ? -1 : 1) * (this.bounding.height - this.props.overflow) : 0;
  },

  onStart: function (e) {
    const wasOpened = this.state.open;
    const bounding = this.aside.getBoundingClientRect();
    const limits = {top: 0, bottom: 0, left: 0, right: 0};

    if (this.is.right) {
      limits.left = window.innerWidth - this.bounding.width;
      limits.right = window.innerWidth - this.props.overflow;
    } else if (this.is.left) {
      limits.left = this.props.overflow;
      limits.right = this.bounding.width;
    } else if (this.is.top) {
      limits.top = this.props.overflow;
      limits.bottom = this.bounding.height;
    } else if (this.is.bottom) {
      limits.top = window.innerHeight - this.bounding.height;
      limits.bottom = window.innerHeight - this.props.overflow;
    }

    this.startMoving(function (translate) {
      this.kickoff = {translate, wasOpened, bounding, limits};
    }.bind(this));
  },

  onMove: function (e) {
    if (!this.kickoff) {
      return;
    }

    if (this.is.vertical) {
      this.setState({translateY: this.getTranslateY(e)});
    } else {
      this.setState({translateX: this.getTranslateX(e)});
    }
  },

  onEnd: function (e) {
    if (!this.kickoff) {
      return;
    }

    let openIt = false;

    if (this.is.top) {
      if (this.kickoff.wasOpened && e.velocityY > this.props.velocity) {
        openIt = false;
      } else if (!this.kickoff.wasOpened && e.velocityY < -this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.y > this.bounding.height / 2;
      }
    } else if (this.is.bottom) {
      if (this.kickoff.wasOpened && e.velocityY < -this.props.velocity) {
        openIt = false;
      } else if (!this.kickoff.wasOpened && e.velocityY > this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.y < (window.innerHeight - this.bounding.height / 2);
      }
    } else if (this.is.left) {
      if (this.kickoff.wasOpened && e.velocityX > this.props.velocity) {
        openIt = false;
      } else if (!this.kickoff.wasOpened && e.velocityX < -this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.x > this.bounding.width / 2;
      }
    } else {
      if (this.kickoff.wasOpened && e.velocityX < -this.props.velocity) {
        openIt = false;
      } else if (!this.kickoff.wasOpened && e.velocityX > this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.x < (window.innerWidth - this.bounding.width / 2);
      }
    }

    this.kickoff = undefined;
    this.slide(openIt);
  },

  slide: function (opening, onComplete) {
    const data = {};

    if (this.is.vertical) {
      data.keyTranslate = 'translateY';
      data.currentTranslate = this.state.translateY;
      data.finalTranslate = this.getFinalY(opening);
    } else {
      data.keyTranslate = 'translateX';
      data.currentTranslate = this.state.translateX;
      data.finalTranslate = this.getFinalX(opening);
    }

    const nextState = {translateX: 0, translateY: 0, translateZ: 0};
    nextState[data.keyTranslate] = data.finalTranslate;

    Utils.animate.range({
      start: data.currentTranslate,
      end: data.finalTranslate,
      duration: this.props.duration * Math.abs(data.currentTranslate - data.finalTranslate) / window.innerWidth,
      callback: function (translate) {
        nextState[data.keyTranslate] = translate;
        this.setState(nextState);
      }.bind(this),
      done: function () {
        nextState[data.keyTranslate] = 0;
        nextState.open = opening;
        nextState.moving = false;
        this.setState(nextState, onComplete);
      }.bind(this)
    });

  },

  // Fully open the aside from its current position
  open: function () {
    if (!this.state.open && !this.state.moving) {
      this.startMoving(function () {
        this.slide(true);
      }.bind(this));
    }
  },

  // Fully close the aside from its current position
  close: function () {
    if (this.state.open) {
      this.startMoving(function () {
        this.slide(false);
      }.bind(this));
    }
  },

  // Cancel everything! Will fade out the aside and do no listen to the current pan if one
  cancel: function () {
    this.kickoff = undefined;
    Velocity(this.aside, {
      opacity: [0, this.getOpacity()]
    }, {
      duration: 200,
      complete: function () {
        this.setState({open: false, moving: false, translateX: 0, translateY: 0, translateZ: 0});
      }.bind(this)
    });
  },

  // Keep the aside at the same place but switch from this.state.open = true to false,
  // calculating a new translateX or translateY to stay in place
  startMoving: function (callback) {
    const translate = {x: 0, y: 0};

    if (this.is.vertical) {
      translate.y = this.getTranslateY();
    } else {
      translate.x = this.getTranslateX();
    }

    this.setState({open: false, moving: true, translateX: translate.x, translateY: translate.y}, function () {
      callback(translate);
    }.bind(this));
  },

  render: function() {
    const classes = React.addons.classSet({
      'aside': true,
      'is-left': this.is.left,
      'is-right': this.is.right,
      'is-top': this.is.top,
      'is-bottom': this.is.bottom,
      'is-open': this.state.open,
      'is-moving': this.state.moving
    });

    const styles = {
      zIndex: this.props.zIndex,
      opacity: this.getOpacity(),
      transform: null
    };

    if (this.is.vertical) {
      styles.height = this.props.size;
    } else {
      styles.width = this.props.size;
    }

    if (this.state.open) {
      styles[this.props.position] = 0;
      styles[this.movingBorder] = 'auto';
    } else {
      let positionProperty, positionValue;

      if (this.props.overflow && this.isMounted()) {
        positionProperty = this.props.position;
        positionValue = this.props.overflow - this.bounding[this.is.vertical ? 'height' : 'width'];
      } else {
        positionProperty = this.movingBorder;
        positionValue = '100%';
      }

      styles[positionProperty] = positionValue;

      if (this.state.translateX || this.state.translateY) {
        styles.transform =
          'translateX('+this.state.translateX+'px) '+
          'translateY('+this.state.translateY+'px) '+
          'translateZ(0)';
      }
    }


    const grapStyles = {};

    if (this.is.vertical) {
      grapStyles.height = this.props.grap;
      if (this.is.bottom) grapStyles.top = -this.props.grap;
      else grapStyles.bottom = -this.props.grap;
    } else {
      grapStyles.width = this.props.grap;
      if (this.is.left) grapStyles.right = -this.props.grap;
      else grapStyles.left = -this.props.grap;
    }

    const maskStyles = { display: 'none', opacity: Math.min(0.6, this.getOpacity(true)) };

    if (this.state.open || this.state.moving) {
      maskStyles.display = 'block';
    }

    return (
      <div>
        <div className="aside-mask" style={maskStyles}></div>
        <aside className={classes} style={styles}>
          <div className="aside-grap" style={grapStyles}></div>
          <div className="aside-content">
            {this.props.children}
          </div>
        </aside>
      </div>
    );
  }
});
