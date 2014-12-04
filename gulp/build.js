var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('styles:build', $.config.styles);

gulp.task('scripts:build', $.config.scripts);

gulp.task('build', ['styles:build', 'scripts:build']);
