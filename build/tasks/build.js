var to5 = require('gulp-6to5');
var gulp = require('gulp');
var sass = require('gulp-sass');
var paths = require('../paths');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var compilerOptions = require('../6to5-options');

var assign = Object.assign || require('object.assign');

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
gulp.task('build-system', function () {
  return gulp.src(paths.source)
    .pipe(plumber())
    .pipe(changed(paths.output, {extension: '.js'}))
    .pipe(sourcemaps.init())
    .pipe(to5(assign({}, compilerOptions, {modules:'system'})))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/' + paths.root }))
    .pipe(gulp.dest(paths.output));
});

// copies changed html files to the output directory
gulp.task('build-html', function () {
  return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output));
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-html', 'build-sass'],
    callback
  );
});

gulp.task('build-sass', function () {
  return gulp
    .src('./styles/main.scss')
    .pipe( sourcemaps.init() )
    .pipe(
      sass({
        outputStyle: 'compressed',
        errLogToConsole: true,
        // includePaths: ['./web/bower_components/bootstrap-sass-official/assets/stylesheets/']
      })
    )
    .pipe( sourcemaps.write() )
    .pipe( gulp.dest('./styles/') )
    .pipe( browserSync.reload({stream:true}) )
  ;
});