var gulp = require('gulp');
var $    = require('./utils/$');

// Are we using watchify?
var bigBrother = false;

function browserify() {
  var bundler,
      options = $.watchify.args;

  options.debug = true;

  function bundle() {
    return bundler.bundle()
      .on('error', $.on.error)
      .pipe($.source($.paths.browserify.app))
      .pipe(gulp.dest($.paths.build.dir))
      .pipe($.if($.config.live, $.reloadStream()));;
  }

  if (bigBrother) {
    bundler = $.watchify($.browserify($.paths.browserify.app, options));
    bundler.on('update', bundle);
  } else {
    bundler = $.browserify($.paths.browserify.app, options);
  }

  bundler.transform($.reactify);
  bundler.transform($.to5.configure({
    blacklist: ['react']
  }));

  return bundle();
}

gulp.task('browserify', function () {
  bigBrother = false;
  return browserify();
});

gulp.task('browserify:watch', function () {
  bigBrother = true;
  return browserify();
});
