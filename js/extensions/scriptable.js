/*
 * SCRIPTABLE EXTENSION
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
  'extension/scriptable',

  // DEPENDANCIES
  [
    'utils/inheritance',
    'utils/decorator'
  ],

  // CALLBACK
  function ( OBJECT, Decorator ) {

    function Scriptable ( object ) {
      this.superclass.constructor( object );
    }
    Scriptable.prototype = {};

    OBJECT.extend( Scriptable, Decorator );

    Scriptable.prototype.getScript = function () {
      this.getProperty('script');
    };

    return Scriptable;
  }
);
