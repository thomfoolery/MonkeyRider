/*
 * TRIG UTILITIES MODULE
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
 *   degToRad ( degrees )         : INT
 * 
 *   radToDeg ( radians )         : INT
 * 
 *   angle ( x1, y1, x2, y2 )     : INT
 * 
 *   distance ( x1, y1, x2, y2 )  : INT
 * 
 */
define(

  // MODULE NAME
  'utils/trig',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {

    trigUtils = {
      // calculations
      degToRad: function ( degrees ) {
          return (( degrees * Math.PI ) / 180 );
      },
      radToDeg: function ( radians ) {
          return (( radians * 180 ) / Math.PI );
      },
      angle: function ( x1, y1, x2, y2 ){
          return Math.atan(( y2 - y1 ) / ( x2 - x1 ));
      },
      distance: function ( x1, y1, x2, y2 ){
          return Math.sqrt(( Math.pow( ( x2 - x1 ), 2 ) + Math.pow( ( y2 - y1 ), 2 ) ));
      }
    };

    return trigUtils;
  }
);
