(function(window) {

  var _ = window._ || {
    isNumber: function(value) {
      return typeof value === "number" || toString.call(value) === "[object Number]";
    },
    forEach: function() {

    },
    extend: function() {

    }
  }

  function HayStack(compare) {
    this.needles = [];
    this.compare = compare || function (a, b) { return a === b ? 0 : (a < b ? -1 : 1); }; 
  }

  // O( 1 )
  HayStack.prototype.length = function() {
    return this.needles.length;
  }

  // O( 1 )
  HayStack.prototype.isEmpty = function() {
    return this.length() === 0;
  }

  // O( log(n) )
  HayStack.prototype.indexOf = function(needle, start, end) {
    start = start || 0;
    end = end || this.length();
    var pivot = parseInt(start + (end - start) / 2, 10);

    if(end - start <= 1 || this.compare(this.needles[pivot], needle) === 0) return pivot;

    if(this.compare(this.needles[pivot], needle) < 0) {
      return this.indexOf(needle, pivot, end);
    } else{
      return this.indexOf(needle, start, pivot);
    }
  }

  // O( n + log(n) )
  HayStack.prototype.add = function(needle) {
    this.needles.splice(this.indexOf(needle) + 1, 0, needle);
    return this;
  }

  // O( n + log(n) )
  HayStack.prototype.remove = function(needle) {
    this.needles.splice(this.indexOf(needle), 1);
    return this;
  }

  // O( 2n + 2 log(n) )
  HayStack.prototype.update = function(needle, update, opts) {
    this.remove(needle);
    update(needle, opts);
    this.add(needle);
    return this;
  }

  // O( 1 )
  HayStack.prototype.pop = function() {
    return this.needles.pop();
  }

  // O( 1 )
  HayStack.prototype.shift = function() {
    return this.needles.shift();
  }

  // O( 1 )
  HayStack.prototype.get = function(index) {
    return this.needles[index];
  }


  var FindMe = {};

  var defaultNames = {
    findme: "findme",
    neighbors: "neighbors",
    costTo: "costTo"
  };

  FindMe.util = {
    clean: function(listToClean, propertyToDelete) {
      _.forEach(listToClean, function(item) {
        delete item[propertyToDelete];
      })
    },
    reversePath: function(fromNode, findmeProperty) {
      var path = [], currentNode = fromNode;

      while (currentNode[findmeProperty].parent) {
        path.push(currentNode);
        currentNode = currentNode[findmeProperty].parent;
      }

      return path.reverse();
    }
  }

  // Requirements:
  // "item.neighbors(opts)" method returning all nodes near one node
  // "item.costTo(item, opts)" method returning the cost to move through the node

  FindMe.astar = function(start, end, opts) {
    var heuristic = opts.heuristic || function() { return 1; },
      weight = opts.weight || 1,
      names = _.extend({}, defaultNames, opts.names),
      //openList = [start],
      openList = new HayStack( function (a, b) { return a[names.findme].rank - b[names.findme].rank; } ),
      cleanList = [start],
      node, cost;

    start[names.findme] = {
      cost: 0
    };

    openList.add(start);

    while (!openList.isEmpty()) {
      node = openList.shift();
      node[names.findme].closed = true;

      // Congrats! You reached your destination point,
      // Let's stop here and return the path to get there
      if (node === end) {
        var path = FindMe.util.reversePath(node, names.findme);
        if (opts.clean) {
          FindMe.util.clean(cleanList, names.findme);
        }
        return path;
      }

      _.forEach(node[names.neighbors](opts), function(neighbor) {
        neighbor[names.findme] = neighbor[names.findme] || {};
        // Get the cost to move to a neighbor node
        cost = node[names.costTo](neighbor, opts);

        // If the node is already closed or unreachable (== its cost is not a number),
        // we don't need to do anything.
        if (!neighbor[names.findme].closed && _.isNumber(cost)) {
          // If not, we can get the total cost by adding the current node cost
          // to the cost to move to the next node
          cost = node[names.findme].cost + cost;

          // If it's a brand new node or if we have find a quicker way to go the next node,
          // we need to update it.
          if (!neighbor[names.findme].opened || cost < neighbor[names.findme].cost) {
            neighbor[names.findme].cost = cost;
            neighbor[names.findme].heuristic = neighbor[names.findme].heuristic || weight * heuristic(neighbor, end);
            neighbor[names.findme].parent = node;

            var rank =  neighbor[names.findme].cost + neighbor[names.findme].heuristic;

            if (!neighbor[names.findme].opened) {
              neighbor[names.findme].opened = true;
              neighbor[names.findme].rank = rank;
              openList.add(neighbor);

              if (opts.clean) {
                cleanList.push(neighbor);
              }
            } else {
              openList.update(neighbor, function (item) { item[names.findme].rank = rank; });
            }
          }

        }
      });
    }

    if (opts.clean) {
      FindMe.util.clean(cleanList, names.findme);
    }

    return [];

  }

  window.FindMe = FindMe;

})(window)