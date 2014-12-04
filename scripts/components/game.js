// TODO: use and export ES6 class
// export class Game {
//   render () {
//     return (
//       <div className="game">Get Back Home</div>
//     )
//   }
// }

const React = require('react');

export const Game = React.createClass({
  render: function() {
    return (
      <h1 className="game">Get Back Home</h1>
    );
  }
});
