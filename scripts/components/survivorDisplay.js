import * as React from 'react';

export default React.createClass({
  render: function() {
    const survivor = this.props.survivor;

    return (
      <div className="survivor">
        {survivor.name}
      </div>
    );
  }
});
