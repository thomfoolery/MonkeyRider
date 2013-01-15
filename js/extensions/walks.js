/*
 * WALK ACTION
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
 *
 */
define(

  // MODULE NAME
  'extension/walks',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {

    function Walks ( object ) {

      this._super = object;
      object.constructor.call( this, arguments );

      this.setDestination = function () {

      };

    }

    return Walks;
  }
);
