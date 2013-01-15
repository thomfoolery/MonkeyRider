/*
 * FACTORY MODULE
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
 *
 */
define(

  // MODULE NAME
  'module/factory',

  // DEPENDANCIES
  [
    'utils/inheritance',

    'object/entity',
    'object/sprite',

    'extension/scriptable',
    'extension/speaks'
  ],

  // CALLBACK
  function Factory ( Inheritance, Entity, Sprite, Scriptable, Speaks ) {

    var _type = {
          "Entity": Entity,
          "Sprite": Sprite
        }

      , _ext = {
          "scriptable":  Scriptable,
          "speaks": Speaks
        }

      , _ctx
      , _scene
      ;

    return {

      "init": function ( ctx, scene ) {

        _ctx    = ctx;
        _scene  = scene;

      },

      "create": function ( def ) {

        var object = _type[ def.type ].create( def.cfg, _ctx, _scene )
          , extension
          ;

        for ( var ext in def.cfg.extensions ) {

          extension = _ext[ ext ];
          object = extension( object, def.cfg.extensions[ ext ] );
        }

        return object;
      },

      "extend": function () {

      }

    };

    function extend ( subClass, superClass ) {

      function F () {}
      F.prototype = superClass;
      subClass.prototype = new F();
      subClass.prototype.constructor = subClass;

      subClass.superclass = superClass.prototype;
      if ( superClass.prototype.constructor === Object.prototype.constructor ) {
        superClass.prototype.constructor = superClass;
      }
    }

    function augment ( recievingClass, givingClass ) {

      for ( var methodName in givingClass.prototype ) {

        if ( ! recievingClass.prototype[ methodName ] ) {
          recievingClass.prototype[ methodName ] = givingClass.prototype[ methodName ];
        }
      }
    }
  }
);
