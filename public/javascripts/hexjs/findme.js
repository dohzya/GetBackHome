(function (window) {

  var _ = window._ || {
    isNumber: function () {

    },
    forEach: function () {

    },
    extend: function () {

    }
  }

  var FindMe = {};

  var defaultNames = {
    findme: "findme",
    neighbors: "neighbors",
    costTo: "costTo"
  };

  FindMe.util = {
    clean: function (listToClean, propertyToDelete) {
      _.forEach(listToClean, function (item) {
        delete item[propertyToDelete];
      })
    },
    reversePath: function (fromNode, findmeProperty) {
      var path = [], currentNode = fromNode;

      while (currentNode[findmeProperty].parent) {
        path.push(currentNode);
        currentNode = currentNode[findmeProperty].parent;
      }

      return path.reverse();
    }
  }

  // Requirements:
  // "neighbors" method returning all nodes near one node
  // "costTo" method returning the cost to move through the node

  FindMe.astar = function (start, end, opts) {
    var heuristic = opts.heuristic || function () { return 1; },
      weight = opts.weight || 1,
      names = _.extend({}, defaultNames, opts.names),
      openList = [start],
      cleanList = [start],
      node, cost;

    start[names.findme] = {
      cost: 0
    };

    while (openList.length > 0) {
      node = openList.pop();
      node[names.findme].closed = true;

      // Congrats! You reached your destination point,
      // Let's stop here and return the path to get there
      if (node.x() == end.x() && node.y() == end.y()) {
      }
      if (node === end) {
        var path = FindMe.util.reversePath(node, names.findme);
        if (opts.clean) {
          FindMe.util.clean(cleanList, names.findme);
        }
        return path;
      }

      _.forEach(node[names.neighbors](opts), function (neighbor) {
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
            neighbor[names.findme].rank =  neighbor[names.findme].cost + neighbor[names.findme].heuristic;
            neighbor[names.findme].parent = node;

            if (!neighbor[names.findme].opened) {
              neighbor[names.findme].opened = true;
              // TODO : add n to openList
              openList.push(neighbor);
              openList = _.sortBy(openList, function (item) { return 1/item[names.findme].rank; });

              if (opts.clean) {
                cleanList.push(neighbor);
              }
            } else {
              // TODO : update n position in openList based on rank
              openList = _.sortBy(openList, function (item) { return 1/item[names.findme].rank; });
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