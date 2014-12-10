import * as React from 'react';
import * as Hammer from 'hammerjs';

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
      velocity: 1,
      duration: 500,
      size: '80%',
      zZndex: 1
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
  },

  componentDidMount: function () {
    this.aside = this.getDOMNode().querySelector('.aside');
    this.bounding = this.aside.getBoundingClientRect();

    window.addEventListener('resize', this.handleResize);

    this.hammer = new Hammer(this.getDOMNode());

    this.hammer.on('panstart', this.onStart);
    this.hammer.on('panend', this.onEnd);
    this.hammer.on('panmove', this.onMove);
  },

  componentDidUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
  },

  handleResize: function () {
    this.bounding = this.aside.getBoundingClientRect();
  },

  getTranslateX: function (e, start) {
    const nextTranslate = (start || (this.kickoff && this.kickoff.translate.x) || 0) + e.deltaX;
    return Math.sign(nextTranslate) * Math.min(Math.abs(nextTranslate), this.bounding.width);
  },

  getTranslateY: function (e, start) {
    const nextTranslate = (start || (this.kickoff && this.kickoff.translate.y) || 0) + e.deltaY;
    return Math.sign(nextTranslate) * Math.min(Math.abs(nextTranslate), this.bounding.height);
  },

  getFinalX: function (opening) {
    return opening ? (this.is.right ? -1 : 1) * this.bounding.width : 0;
  },

  getFinalY: function (opening) {
    return opening ? (this.is.bottom ? -1 : 1) * this.bounding.height : 0;
  },

  getStartX: function () {
    return this.state.open ? (this.is.right ? -1 : 1) * this.bounding.width : 0;
  },

  getStartY: function () {
    return this.state.open ? (this.is.bottom ? -1 : 1) * this.bounding.height : 0;
  },

  onStart: function (e) {
    const translate = {x: 0, y: 0};

    if (this.is.vertical) {
      translate.y = this.getTranslateY(e, this.getStartY());
    } else {
      translate.x = this.getTranslateX(e, this.getStartX());
    }

    // Remove open stating and switching back to moving state
    // setting starting translate based on current status
    this.setState({open: false, moving: true, translateX: translate.x, translateY: translate.y}, function () {
      this.kickoff = {translate};
    }.bind(this));
  },

  onMove: function (e) {
    if (this.kickoff) {
      if (this.is.vertical) {
        this.setState({translateY: this.getTranslateY(e)});
      } else {
        this.setState({translateX: this.getTranslateX(e)});
      }
    }
  },

  onEnd: function (e) {
    let openIt = false;

    if (this.is.top) {
      if (this.state.open && e.velocityY > this.props.velocity) {
        openIt = false;
      } else if (!this.state.open && e.velocityY < -this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.y > this.bounding.height / 2;
      }
    } else if (this.is.bottom) {
      if (this.state.open && e.velocityY < -this.props.velocity) {
        openIt = false;
      } else if (!this.state.open && e.velocityY > this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.y < (window.innerHeight - this.bounding.height / 2);
      }
    } else if (this.is.left) {
      if (this.state.open && e.velocityX > this.props.velocity) {
        openIt = false;
      } else if (!this.state.open && e.velocityX < -this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.x > this.bounding.width / 2;
      }
    } else {
      if (this.state.open && e.velocityX < -this.props.velocity) {
        openIt = false;
      } else if (!this.state.open && e.velocityX > this.props.velocity) {
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

    const properties = {translateX: 0, translateY: 0, translateZ: 0};
    const nextState = {translateX: 0, translateY: 0, translateZ: 0};
    properties[data.keyTranslate] = [data.finalTranslate, data.currentTranslate];
    nextState[data.keyTranslate] = data.finalTranslate;

    Velocity(this.aside, properties, {
      duration: this.props.duration * Math.abs(data.currentTranslate - data.finalTranslate) / window.innerWidth,
      complete: function () {
        nextState.open = opening;
        nextState.moving = false;
        this.setState(nextState, onComplete);
      }.bind(this)
    });

  },

  open: function () {
    if (!this.state.open && !this.state.moving) {
      this.slide(true);
    }
  },

  close: function () {
    if (this.state.open && !this.state.moving) {
      this.slide(false);
    }
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
      zIndex: this.props.zIndex
    };

    if (this.is.vertical) {
      styles.height = this.props.size;
    } else {
      styles.width = this.props.size;
    }

    if (this.state.open) {
      if (this.is.right) { styles.right = 0; styles.left = 'auto'; }
      else if (this.is.left) { styles.left = 0; styles.right = 'auto'; }
      else if (this.is.top) { styles.top = 0; styles.bottom = 'auto'; }
      else if (this.is.bottom) { styles.bottom = 0; styles.top = 'auto'; }

      styles.transform = null;
    } else if (this.state.translateX || this.state.translateY) {
      styles.transform =
        'translateX('+this.state.translateX+'px) '+
        'translateY('+this.state.translateY+'px) '+
        'translateZ(0)';
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

    return (
      <div>
        <div className="aside-mask"></div>
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
