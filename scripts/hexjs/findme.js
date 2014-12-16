'use strict';

import HayStack from './hayStack.js';
import Utils from './utils.js';

const defaultNames = {
  findme: "findme",
  neighbors: "neighbors",
  costTo: "costTo"
};

const utils = {
  clean: function (listToClean, propertyToDelete) {
    listToClean.forEach(function (item) {
      delete item[propertyToDelete];
    });
  },
  reversePath: function (fromNode, findmeProperty) {
    var path = [], currentNode = fromNode;

    while (currentNode[findmeProperty].parent) {
      path.push(currentNode);
      currentNode = currentNode[findmeProperty].parent;
    }

    return path.reverse();
  }
};

// Requirements:
// "item.neighbors(opts)" method returning all nodes near one node
// "item.costTo(item, opts)" method returning the cost to move through the node
function astar (start, end, opts) {
  var heuristic = opts.heuristic || function () { return 1; },
    weight = opts.weight || 1,
    names = Utils.extend({}, defaultNames, opts.names),
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
      var path = utils.reversePath(node, names.findme);
      if (opts.clean) {
        utils.clean(cleanList, names.findme);
      }
      return path;
    }

    node[names.neighbors](opts).forEach(function (neighbor) {
      neighbor[names.findme] = neighbor[names.findme] || {};
      // Get the cost to move to a neighbor node
      cost = node[names.costTo](neighbor, opts);

      // If the node is already closed or unreachable (== its cost is not a number),
      // we don't need to do anything.
      if (!neighbor[names.findme].closed && Utils.isNumber(cost)) {
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
    utils.clean(cleanList, names.findme);
  }

  return [];
}

export default {
  astar: astar
};
