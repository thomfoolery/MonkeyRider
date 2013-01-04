/*
 * DECORATOR CLASS
 * =====================
 *
 * PUBLIC PROPERTIES --- (!) IMMUTABLE
 *------------------
 *
 *   N/A
 *
 * PUBLIC SETTERS
 *---------------
 *
 *   N/A
 *
 * PUBLIC METHODS
 *---------------
 *
 *   getScript ()
 *
 */
define(

  // MODULE NAME
  'utils/decorator',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {

    function Decorator ( object ) {

      this.object = object;

      for ( var key in object ) {
        if ( this[ methodName ] == undefined && typeof this.object[ key ] === 'function' ) {

          var self = this;
          ( function ( methodName ) {
            self[ methodName ] = function () {
              return self.object[ methodName ].apply( self, arguments );
            }
          })( key );
        }
      }

    }

    return Decorator;
  }
);
