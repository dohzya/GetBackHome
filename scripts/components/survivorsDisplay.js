import * as React from 'react';
import * as Reflux from 'reflux';
import SurvivorDisplay from './survivorDisplay';
import {SurvivorStore} from '../alive/survivor.js';

export default React.createClass({
  mixins: [Reflux.connect(SurvivorStore, 'survivors')],

  getInitialState: function () {
    return {
      survivors: SurvivorStore.all()
    }
  },

  render: function() {
    const survivors = this.state.survivors.map(function (survivor) {
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
