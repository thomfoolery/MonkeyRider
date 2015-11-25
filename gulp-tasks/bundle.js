var gulp = require('gulp');
var path = require("path");
var Builder = require('systemjs-builder');

var builder = new Builder();

var options = {
  minify: true,
  runtime: false,
  sourceMaps: true
};

gulp.task('bundle', ( cb ) => {

  return builder
    .loadConfig('src/scripts/system.config.js')
    .then( () => {

      builder.config({
        paths: {
          "game/config/*": "src/scripts/config/*",
          "game/module/*": "src/scripts/module/*"
        },
      });

      return builder.buildStatic('./src/scripts/app', './src/scripts/bundle.js', options )
        .then( trees => {
          console.log();
          console.log("Build complete.");
          console.log();
        })
        .catch( err => {
          console.log( err );
        })
      ;

    })
  ;

});