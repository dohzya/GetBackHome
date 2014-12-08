if (!window.CustomEvent) {
  (function () {
    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  })();
}

export default {
  componentWillMount: function() {
    this._listeners = [];
  },

  on: function (event, callback) {
    if (this.isMounted()) {
      this._listeners.push({event, callback});
      this.getDOMNode().addEventListener(event, callback);
    } else {
      throw new Error('Component must be mounted before adding event listeners');
    }
  },

  off: function (event, callback) {
    if (this.isMounted()) {
      let index = undefined;

      this._listeners.forEach(function (listener, i) {
        if (listener.event === event && listener.callback === callback) {
          index = i;
        }
      });

      if (index !== undefined) {
        this._listeners.splice(index, 1);
      }

      this.getDOMNode().removeEventListener(event, callback);
    } else {
      throw new Error('Component must be mounted before removing event listeners');
    }
  },

  dispatch: function (event, data, bubbles = true, cancelable = true) {
    if (this.isMounted()) {
      this.getDOMNode().dispatchEvent(new CustomEvent(event, {detail: data, bubbles, cancelable}));
    } else {
      throw new Error('Component must be mounted before dispatching custom events');
    }
  },

  componentWillUnmount: function() {
    this._listeners.forEach(function (listener) {
      this.getDOMNode().removeEventListener(listener.event, listener.callback);
    });
  }
}
