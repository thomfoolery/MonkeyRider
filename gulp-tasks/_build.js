var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('build', ['bundle'], () => {

  return runSequence(
    ['copy-to-dist'],
    ['modify-html']
  );

});

gulp.task('copy-to-dist', () => {

  del('dist/**/*');

  return gulp.src('src/**/*')
    .pipe( gulp.dest('dist') )
  ;

});

gulp.task('modify-html', () => {

  return gulp.src('dist/index.html')
    .pipe( $.cheerio( ( $, doc ) => {
      $('script').remove();
      $('body').append('<script src="scripts/bundle.js" />')
    }) )
    .pipe( gulp.dest('dist') )
  ;

});