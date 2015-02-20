var gulp = require('gulp');
var browserSync = require('browser-sync');
var supervisor = require( "gulp-supervisor" );

gulp.task('serve', ['build'], function( done ) {

  supervisor("./api/server.js",{
    watch: [ "api" ]
  });

  browserSync.init( null, {
    port:  9000,
    proxy: "localhost:9001",
    middleware: function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    }
  }, done );

});
