import * as React from 'react';
import SurvivorDisplay from './survivorDisplay';

export default React.createClass({
  render: function() {
    const survivors = this.props.survivors.map(function (survivor) {
      return (
        <li>
          <SurvivorDisplay survivor={survivor} />
        </li>
      );
    });

    return (
      <ul className="survivors no-style">
        {survivors}
      </ul>
    );
  }
});
