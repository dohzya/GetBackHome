/* Taken from Velocity.js */
const rAFShim = (function() {
  let timeLast = 0;

  return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    const timeCurrent = (new Date()).getTime();
    let timeDelta;

    /* Dynamically set delay on a per-tick basis to match 60fps. */
    /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
    timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
    timeLast = timeCurrent + timeDelta;

    return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
  };
})();

// console.log(Velocity.Easings);

const raf = window.requestAnimationFrame || rAFShim;

/* Args:
 * start[number]
 * end[number]
 * duration[number]
 * callback[function]
 * done[function]
 * easing[string]
 */
function range(args) {
  if (!args.duration) {
    // Woohoo, teleportation to the end!
    return args.done && args.done(args.end);
  }

  let startedAt;
  const size = args.end - args.start;

  function rangeTick (timestamp) {
    if (!startedAt) startedAt = timestamp;
    const progress = (timestamp - startedAt) / args.duration;

    if (progress > 1) {
      args.done && args.done(args.end, 1);
    } else {
      args.callback(args.start + (progress * size), progress);
      raf(rangeTick);
    }
  }

  raf(rangeTick);
}

export default {
  range: range
}
