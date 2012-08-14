/*
 * SCENE MODULE
 * ============
 *
 * PUBLIC PROPERTIES --- (!) IMMUTABLE
 *------------------
 * 
 *   width   : INT
 *  height   : INT
 *       x   : INT
 *       y   : INT
 *
 *
 * 
 * PUBLIC SETTERS
 *---------------
 *
 *   setProp ( key, value )
 *
 *
 * 
 * PUBLIC METHODS 
 *---------------
 *
 *   getSceneObjectData( objectId, action )
 * 
 *   draw( timeLapsed )
 * 
 */
define(

  // MODULE NAME
  'class/static',

  // DEPENDANCIES
  ['utils/canvas'],

  // CALLBACK
  function( canvasUtils ){

    function Static ( properties, CTX, ctxRatio ){

      var _P = {

            width:      CTX.canvas.width,
            height:     CTX.canvas.height,
            x:          0,
            y:          0,

            gfx: {
              image:    new Image(),
              path:     '',
              ready:    false,
              canvas:   null,
              ctx:      null,
              scale:    1
            }

          },

          self = this,

          _canvas,
          _ctx

          ;


      $.extend( true, _P, properties );
      _init();



// --- PRIVATE FUNCTIONS --- //

      function _init () {

        if ( _P.gfx.path != null ){
          
          _P.gfx.image.onload = function() {

            var imageData;

            _P.width  = Math.round( _P.gfx.image.width  * ctxRatio * _P.gfx.scale );
            _P.height = Math.round( _P.gfx.image.height * ctxRatio * _P.gfx.scale );

            canvasUtils.proccesGfxToCanvas( _P.gfx, ctxRatio );
          }
          _P.gfx.image.src = _P.gfx.path;

        }
      }



// --- IMMUTABLE PUBLIC PROPERTIES --- //

      Object.defineProperty( this, 'width', {
        enumerable : true,
        get : function(){ return _P.width; },
        set : function(){ throw Error( 'Static instance property "width" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( this, 'height', {
        enumerable : true,
        get : function(){ return _P.height; },
        set : function(){ throw Error( 'Static instance property "height" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( this, 'x', {
        enumerable : true,
        get : function(){ return _P.x; },
        set : function(){ throw Error( 'Static instance property "x" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( this, 'y', {
        enumerable : true,
        get : function(){ return _P.y; },
        set : function(){ throw Error( 'Static instance property "y" can not be set directly. Use setter method.' ); }
      });



// --- PUBLIC SETTERS --- //

      this.setProp = function ( key, value ) {
        
        if ( typeof value === typeof _P[ key ] ){
          _P[ key ] = value;
        }
      };



// --- PUBLIC METHODS --- //

      this.update = function ( timeLapsed ) {
        
      };

      this.draw = function( timeLapsed ){

      if ( ! _P.gfx.ready ) return;

        CTX.drawImage(
          _P.gfx.canvas,
          0,
          0,
          _P.gfx.canvas.width,
          _P.gfx.canvas.height,
          _P.x * ctxRatio,
          _P.y - self.height,
          self.width,
          self.height
        );

      };
    } // end of CLASS

    return Static;

  }
);