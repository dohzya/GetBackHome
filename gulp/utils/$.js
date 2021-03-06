var plugins     = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var argv        = require('yargs').argv;
var utils       = require('./utils');

// Expose all Gulp plugins found
module.exports = plugins;

// Expose some functions to manage live reloading
module.exports.reload = browserSync.reload;

module.exports.reloadStream = function () {
  return browserSync.reload({stream: true});
};

// Expose some other modules (local or not)
module.exports.through2   = require('through2');
module.exports.lazypipe   = require('lazypipe');
module.exports.browserify = require('browserify');
module.exports.watchify   = require('watchify');
module.exports.reactify   = require('reactify');
module.exports.to5        = require('6to5-browserify');
module.exports.source     = require('vinyl-source-stream');
module.exports.paths      = require('./paths');
module.exports.utils      = utils;

// Expose common useful filters
module.exports.filters = {
  log: function (file) {
    console.log(file.event, file.path);
    return true;
  },
  changed: function (file) {
    return utils.is.changed(file);
  }
};

// Expose functions to handle events
module.exports.on = {
  error: require('./onError')
};

// Expose all supported args from command line
module.exports.config = {
  styles: ['less'],
  scripts: ['browserify'],
  mocked: argv.mocked || argv.m,
  latency: argv.latency || 100,
  history: true,
  port: parseInt(argv.port, 10) || 8000,
  sync: argv.sync === undefined || argv.sync !== 'false',
  live: argv.live === undefined || argv.live !== 'false',
  autoprefixer: argv.autoprefixer && JSON.parse(argv.autoprefixer) || ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
};
