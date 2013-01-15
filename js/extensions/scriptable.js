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

    return function ( supertype, properties ) {

      var Scriptable = Object.create( supertype )
        , props = {
            "message":  null,
            "duration": 0,
            "lapsed":   0,
            "color":    '#ff00fc'
          }
        ;

      $.extend( props, properties );

      supertype.setProperty({
        "extensions": {
          "scriptable": props
        }
      });

      Scriptable.getScriptURL = function ( action ) {

        var script = this.getProperty('scripts.' + action )
          ;

        if ( script === undefined ) return null;
          return script.slice(0);
      };

      Scriptable.setScriptURL = function ( scripting ) {

        var obj = {},
            scriptor = this.getProperty('scriptor')
            ;

        this.setProperty({"scripts": scripting });
        scriptor && scriptor.next();
      };

      return Scriptable;
    }
  }
);