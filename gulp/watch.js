var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('html:watch', function () {
  return $.watch(['./index.html'], {name: 'Html'}, function (files) {
    return gulp.start('sync:reload');
  });
});

gulp.task('styles:watch', $.config.styles.map(function (s) { return s + ':watch'; }));

gulp.task('scripts:watch', $.config.scripts.map(function (s) { return s + ':watch'; }));

gulp.task('watch', ['styles:watch', 'scripts:watch', 'html:watch']);
