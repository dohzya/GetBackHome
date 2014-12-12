import * as React from 'react';

export default React.createClass({
  render: function() {
    const zone = this.props.tile.zone;

    return (
      <div className="tile">
        ({zone.x} x {zone.y}) {zone.biome.name}{zone.structure ? ' with '+zone.structure.name : ''}
      </div>
    );
  }
});
