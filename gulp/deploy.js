var path         = require('path');
var gulp         = require('gulp');
var $            = require('./utils/$');

gulp.task('deploy', function() {
  return gulp.src('', {read: false})
    .pipe($.shell([
      'mkdir deploy',
      'cd deploy && git init',
      'cd deploy && git remote add origin git@github.com:dohzya/GetBackHome.git',
      // 'cd deploy && git fetch',
      'cd deploy && git checkout -b gh-pages',
      'gulp build',
      'cp -rf build deploy',
      'cp -f index.html deploy/index.html',
      // 'gulp usemin',
      // 'gulp minifyHtml',
      'cd deploy && git add . -A',
      'cd deploy && git commit -m "Publish game"',
      'cd deploy && git push -f origin gh-pages'
    ], {
      ignoreErrors: true
    }))
    .on('error', $.on.error);
});
