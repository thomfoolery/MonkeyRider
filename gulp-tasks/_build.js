var path = require("path");
var Builder = require('systemjs-builder');
var builder = new Builder()
var gulp = require('gulp');

gulp.task('default', () => {

  return builder
    .loadConfig('config.js')
    .then( () => {

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
        .then( trees => {
          console.log("Ok");
        })
        .catch( err => {
          console.log( err );
        })
      ;

      // return builder.trace('scripts/app')
      //   .then( trees => {
      //     console.log("Ok");
      //   })
      //   .catch( err => {
      //     console.log( err );
      //   })
      // ;

    })
  ;

});