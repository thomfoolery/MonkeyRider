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
  'object/sprite',

  // DEPENDANCIES
  [
    'object/entity'
  ],

  // CALLBACK
  function ( Entity ) {

    var Sprite = Object.create( Entity );

    Sprite.Sprite = Sprite;

    Sprite.create = function ( properties, ctx, scene ) {

      var obj = Entity.create.call( this, properties, ctx, scene );
      return obj;
    };

    Sprite.setState = function ( state, scriptor ) {

      if ( _.has( this.getProperty('states'), state ) === false ) return; // EXIT

      this.setProperty({ "state": state });

      scriptor && scriptor.next();
    };

    Sprite.draw = function( timeLapsed ){

      var gfx = this.getProperty('gfx')
        , offset = 0
        , state = this.getProperty('state')
        ;

      if ( ! gfx.ready ) return;

      if ( state )
        offset = this.getProperty('states.' + state ).sprite * gfx.width;

      this.CTX.drawImage(
        gfx.canvas,
        offset,
        0,
        gfx.width,
        gfx.height,
        this.x,
        this.y - this.height,
        this.width,
        this.height
      );
    }

    return Sprite;
  }
);
