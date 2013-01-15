/*
 * ITEM CLASS
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
  'object/item',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {

    function Item ( object ) {

      Item.superclass.constructor.apply( this, arguments );

      this.retrieve = function ( state ) {

        var scriptor = this.getProperty('scriptor');

      };

    }

    return Sprite;
  }
);
