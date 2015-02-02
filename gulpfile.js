var gulp = require('gulp')
  , connect = require('gulp-connect')
  ;

gulp.task('serve', function() {

  connect.server({
    livereload: true
  });

  gulp.watch(['./index.html','./app/*.js']);
});

gulp.task('default', ['serve']);