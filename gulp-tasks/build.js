var path = require("path");
var Builder = require('systemjs-builder');
var builder = new Builder()
var gulp = require('gulp');

gulp.task('default', function () {

  return builder
    .loadConfig('config.js')
    .then( function () {

      builder.config({
        baseURL: '.',
        transpiler: 'babel',
        meta: {
          code: {
            format: 'es6'
          }
        }
      });

      return builder.buildSFX('scripts/app', 'scripts/bundle.js')
        .then( function ( trees ) {
          console.log("Ok");
        })
        .catch( function (err) {
          console.log( err );
        })
      ;

      // return builder.trace('scripts/app')
      //   .then( function ( trees ) {
      //     console.log("Ok");
      //   })
      //   .catch( function (err) {
      //     console.log( err );
      //   })
      // ;

    })
  ;

});