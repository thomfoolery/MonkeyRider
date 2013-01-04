/*
 * SPRITE CLASS
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
  'class/sprite',

  // DEPENDANCIES
  [
    'utils/inheritance',

    'class/entity',

    'extension/speech',
    'extension/scriptable'
  ],

  // CALLBACK
  function ( OBJECT, ENTITY, Speech, Scriptable ) {

    function Sprite ( properties, ctx, scene ) {
      Sprite.superclass.constructor.call( this, properties, ctx, scene );
    }

    OBJECT.extend( Sprite, ENTITY );

    Sprite.prototype.setState = function ( state ) {

      var scriptor = this.getProperty('scriptor');

      if ( typeof state !== 'string') throw new Error ('Static object\'s setState() method accepts a string');
      if ( _.has( this.getProperty('states'), state ) )
        this.setProperty('state', state );

      scriptor && scriptor.next();
    };

    //Sprite = new Speech ( Sprite );
    //Sprite = new Scriptable ( Sprite );

    return Sprite;
  }
);
