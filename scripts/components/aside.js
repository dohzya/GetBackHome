import * as React from 'react/addons';
import * as Hammer from 'hammerjs';

export default React.createClass({

  getInitialState: function () {
    return {
      open: false,
      translateX: 0,
      translateY: 0
    }
  },

  getDefaultProps: function () {
    return {
      position: 'right',
      grap: 25,
      velocity: 1,
      duration: 500
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

    this.hammer = new Hammer(this.getDOMNode());

    this.hammer.on('panstart', this.onStart);
    this.hammer.on('panend', this.onEnd);
    this.hammer.on('panmove', this.onMove);
  },

  getTranslateX: function (e) {
    const nextTranslate = this.kickoff.translate.x + e.deltaX;
    return Math.sign(nextTranslate) * Math.min(Math.abs(nextTranslate), this.kickoff.bounding.width);
  },

  getTranslateY: function (e) {
    const nextTranslate = this.kickoff.translate.y + e.deltaY;
    return Math.sign(nextTranslate) * Math.min(Math.abs(nextTranslate), this.kickoff.bounding.height);
  },

  onStart: function (e) {
    this.kickoff = {
      center: {x: e.center.x, y: e.center.y},
      bounding: this.aside.getBoundingClientRect(),
      translate: {x: this.state.translateX, y: this.state.translateY}
    };
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
        openIt = e.center.y > this.kickoff.bounding.height / 2;
      }
    } else if (this.is.bottom) {
      if (this.state.open && e.velocityY < -this.props.velocity) {
        openIt = false;
      } else if (!this.state.open && e.velocityY > this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.y < (window.innerHeight - this.kickoff.bounding.height / 2);
      }
    } else if (this.is.left) {
      if (this.state.open && e.velocityX > this.props.velocity) {
        openIt = false;
      } else if (!this.state.open && e.velocityX < -this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.x > this.kickoff.bounding.width / 2;
      }
    } else {
      if (this.state.open && e.velocityX < -this.props.velocity) {
        openIt = false;
      } else if (!this.state.open && e.velocityX > this.props.velocity) {
        openIt = true;
      } else {
        openIt = e.center.x < (window.innerWidth - this.kickoff.bounding.width / 2);
      }
    }

    if (this.is.vertical) {
      const currentY = this.getTranslateY(e);
      let finalY = 0;

      if (openIt) {
        finalY = (this.is.bottom ? -1 : 1) * this.kickoff.bounding.height;
      }

      Velocity(this.aside, {
        translateY: [finalY, currentY],
        translateZ: 0
      }, {
        duration: this.props.duration * Math.abs(currentY - finalY) / window.innerHeight,
        complete: function () {
          this.kickoff = undefined;
          this.setState({open: openIt, translateX: 0, translateY: finalY});
        }.bind(this)
      });
    } else {
      const currentX = this.getTranslateX(e);
      let finalX = 0;

      if (openIt) {
        finalX = (this.is.right ? -1 : 1) * this.kickoff.bounding.width;
      }

      Velocity(this.aside, {
        translateX: [finalX, currentX],
        translateZ: 0
      }, {
        duration: this.props.duration * Math.abs(currentX - finalX) / window.innerWidth,
        complete: function () {
          this.kickoff = undefined;
          this.setState({open: openIt, translateX: finalX, translateY: 0});
        }.bind(this)
      });
    }
  },

  render: function() {
    const classes = React.addons.classSet({
      'aside': true,
      'is-left': this.is.left,
      'is-right': this.is.right,
      'is-top': this.is.top,
      'is-bottom': this.is.bottom,
      'is-open': this.state.open
    });

    const styles = {};

    if (this.state.translateX || this.state.translateY) {
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
