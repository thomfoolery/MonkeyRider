/*
 * STATIC CLASS
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
  'class/static',

  // DEPENDANCIES
  [
    'utils/inheritance',

    'class/entity'
  ],

  // CALLBACK
  function ( OBJECT, ENTITY ) {

    function Static ( properties, ctx, scene ) {
      Static.superclass.constructor.call( this, properties, ctx, scene );
    }
    OBJECT.extend( Static, ENTITY );

    return Static;
  }
);
