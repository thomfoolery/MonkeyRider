/*
 * ENTITY CLASS
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
  'object/entity',

  // DEPENDANCIES
  [
    'utils/canvas'
  ],

  // CALLBACK
  function ( CANVAS ) {

    var Entity = {};

    Entity.Entity = Entity;

    Entity.create = function ( properties, ctx, scene ) {

      var _P = {

          id: new Date().getTime(),
          width:      0,
          height:     0,
          x:          0,
          y:          0,

          gfx: {
            image:    new Image(),
            path:     '',
            width:    0,
            height:   0,
            ready:    false,
            canvas:   null,
            ctx:      null,
            scale:    1
          },

          stack: -1

        },

        obj = Object.create( this )

        ;

      $.extend( true, _P, properties );

      _P.x = _P.x * ctx.ratio;
      _P.y = ctx.canvas.height - _P.y * ctx.ratio;
      _P.width  = Math.round( _P.gfx.width  * ctx.ratio * _P.gfx.scale );
      _P.height = Math.round( _P.gfx.height * ctx.ratio * _P.gfx.scale );

      if ( _P.gfx.path != null ){

        _P.gfx.image.onload = function() {
          CANVAS.proccesGfxToCanvas( _P.gfx, ctx.ratio );
        };

        _P.gfx.image.src = _P.gfx.path;
      }

      // define properties
      Object.defineProperties( obj,
        {
          "id": {
            enumerable : true,
            get : function(){ return _P.id; },
            set : function(){ throw Error( _P.id + '\'s property "id" is immutable' ); }
          },
          "width": {
            enumerable : true,
            get : function(){ return _P.width; },
            set : function(){ throw Error( _P.id + '\'s property "width" is immutable' ); }
          },
          "height": {
            enumerable : true,
            get : function(){ return _P.height; },
            set : function(){ throw Error( _P.id + '\'s property "height" is immutable' ); }
          },
          "x": {
            enumerable : true,
            get : function(){ return _P.x; },
            set : function(){ throw Error( _P.id + '\'s property "x" is immutable' ); }
          },
          "y": {
            enumerable : true,
            get : function(){ return _P.y; },
            set : function(){ throw Error( _P.id + '\'s property "y" is immutable' ); }
          },
          "CTX": {
            enumerable : true,
            get : function(){ return ctx; },
            set : function(){ throw Error( _P.id + '\'s property "CTX" is immutable' ); }
          },
          "SCENE": {
            enumerable : true,
            get : function(){ return scene; },
            set : function(){ throw Error( _P.id + '\'s property "SCENE" is immutable' ); }
          },
        }
      );

      obj.getProperties = function () {
        return _P;
      };

      obj.getProperty = function ( propertyName ) {

        var dir = propertyName.split('.')
          , root = _P
          , key = dir.shift()
          , value
          ;

        while ( key && ( value = root[ key ] ) ) {
          root = value;
          key = dir.shift();
        }

        return value;
      };

      obj.setProperty = function ( cfg ) {
        $.extend( true, _P, cfg );
      };

      return obj;
    };


    Entity.isMouseOver = function(){

      var MOUSE = this.SCENE.io_CONTROL.getMousePosition()
        , x = Math.round( this.x + this.SCENE.offset.x )
        , y = this.y
        ;

      if ( MOUSE.x > x
        && MOUSE.x < x + this.width
        && MOUSE.y < y
        && MOUSE.y > y - this.height ) {

        return true;
      }

      return false;
    },

    Entity.update = function ( timeLapsed ) {

    },

    Entity.draw = function( timeLapsed ){

      var gfx = this.getProperty('gfx')
          ;

      if ( ! gfx.ready ) return;

      this.CTX.drawImage(
        gfx.canvas,
        0,
        0,
        gfx.width,
        gfx.height,
        this.x,
        this.y - this.height,
        this.width,
        this.height
      );
    }

    return Entity;
  }
);
