class Order {
  constructor (args) {
    this.id = args.id || throw new Error('Order: id is required');
  }
}

class Move extends Order {
  constructor () {
    super({id: 'move'});
  }
}

export default {
  move: new Move()
}
