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
  'class/entity',

  // DEPENDANCIES
  [
    'utils/canvas'
  ],

  // CALLBACK
  function ( CANVAS ) {

    function Entity ( properties, ctx, scene ) {

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

            stack: -1,

            CTX: ctx,
            SCENE: scene

          },

          self = this

          ;

      $.extend( true, _P, properties );
      _init();



      // --- PRIVATE FUNCTIONS --- //

      function _init () {

        _P.width  = Math.round( _P.gfx.width  * _P.CTX.ratio * _P.gfx.scale );
        _P.height = Math.round( _P.gfx.height * _P.CTX.ratio * _P.gfx.scale );

        if ( _P.gfx.path != null ){

          _P.gfx.image.onload = function() {
            CANVAS.proccesGfxToCanvas( _P.gfx, _P.CTX.ratio );
          };

          _P.gfx.image.src = _P.gfx.path;
        }

        _P.x = _P.x * _P.CTX.ratio;
        _P.y = _P.CTX.canvas.height - _P.y * _P.CTX.ratio;
      }



      // --- IMMUTABLE PUBLIC PROPERTIES --- //

      Object.defineProperty( self, 'id', {
        enumerable : true,
        get : function(){ return _P.id; },
        set : function(){ throw Error( _P.id + '\'s instance property "id" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'width', {
        enumerable : true,
        get : function(){ return _P.width; },
        set : function(){ throw Error( _P.id + '\'s instance property "width" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'height', {
        enumerable : true,
        get : function(){ return _P.height; },
        set : function(){ throw Error( _P.id + '\'s instance property "height" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'x', {
        enumerable : true,
        get : function(){ return _P.x; },
        set : function(){ throw Error( _P.id + '\'s instance property "x" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'y', {
        enumerable : true,
        get : function(){ return _P.y; },
        set : function(){ throw Error( _P.id + '\'s instance property "y" can not be set directly. Use setter method.' ); }
      });

      this.getProperties = function () {
        return _P;
      };

      this.getProperty = function ( propertyName ) {

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

      this.setProperty = function ( propertyName, value ) {

        var dir = propertyName.split('.')
          , root = _P
          , key = dir.shift()
          , obj
          ;

        while ( dir.length > 1 && ( obj = root[ key ] ) ) {
          root = obj;
          key = dir.shift();
        }

        return obj[ dir.shift() ] = value;
      };

    }


    // --- PUBLIC METHODS --- //
    Entity.prototype = {

      "act": function ( action ) {

        if ( action.act && typeof self[ action.act ] === 'function' ) {
          self[ action.act ]( action.value );
        }

        if ( action.scriptor )
          action.scriptor.next();
      },

      "isMouseOver": function(){

        var SCENE = this.getProperty('SCENE')
          , MOUSE = SCENE.io_CONTROL.getMousePosition()
          , width = this.getProperty('width')
          , height = this.getProperty('height')
          , x = Math.round( this.x + SCENE.offset.x )
          , y = this.getProperty('y')
          ;

        if ( MOUSE.x > x
          && MOUSE.x < x + width
          && MOUSE.y < y
          && MOUSE.y > y - height ){

          return true;
        }

        return false;
      },

      "update": function ( timeLapsed ) {

      },

      "draw": function( timeLapsed ){

        var gfx = this.getProperty('gfx')
          , x, y ;

        if ( ! gfx.ready ) return;

        x = this.getProperty('x');
        y = this.getProperty('y');

        this.getProperty('CTX').drawImage(
          gfx.canvas,
          0,
          0,
          gfx.width,
          gfx.height,
          x,
          y - this.height,
          this.width,
          this.height
        );
      }

    };

    return Entity;
  }
);
