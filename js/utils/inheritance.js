"use strict";
/*
 * INHERITANCE UTIL
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
 *   clone ()
 *   extend ()
 *   augment ()
 *
 */
define(

  // MODULE NAME
  'utils/inheritance',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {

    return {

      "clone" : function ( object ) {
        function F () {}
        F.prototype = object;
        return new F();
      },

      "extend" : function ( subClass, superClass ) {

        function F () {}
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        subClass.superclass = superClass.prototype;
        if ( superClass.prototype.constructor === Object.prototype.constructor ) {
          superClass.prototype.constructor = superClass;
        }
      },

      "augment": function ( recievingClass, givingClass ) {

        for ( var methodName in givingClass.prototype ) {

          if ( ! recievingClass.prototype[ methodName ] ) {
            recievingClass.prototype[ methodName ] = givingClass.prototype[ methodName ];
          }
        }
      }

    }
  }
);
