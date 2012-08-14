/*
 * SCENE MODULE
 * ============
 *
 * PUBLIC PROPERTIES --- (!) IMMUTABLE
 *------------------
 * 
 *   width   : INT
 *  height   : INT
 *  offset   : OBJ
 *      -> x : INT
 *      -> y : INT
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
  'class/scene',

  // DEPENDANCIES
  ['utils/canvas'],

  // CALLBACK
  function( canvasUtils ){

    function Scene ( properties, CTX, ctxRatio, io_CONTROL ){

      var _P = {

            width:         CTX.canvas.width,
            height:        CTX.canvas.height,
            offset:        {
              x: 0,
              y: 0
            },

            sceneDataURL:  null,
            sceneData :    {},

            gfx: {

              background: {
                image:    new Image(),
                path:     '/img/bg/scene-2.png',
                ready:    false,
                canvas:   null,
                ctx:      null
              },

              sprites: {
                image:    new Image(),
                path:     '',
                ready:    false,
                canvas:   null,
                ctx:      null
              }
            },

            objects: {
              hash: {},
              foreground: [],
              background: [],
              animated:   [], 
              actable:    []
            },

            selection: null

          },

          _canvas,
          _ctx

          ;


      $.extend( true, _P, properties );
      _init();



// --- PRIVATE FUNCTIONS --- //

      function _init () {

        if ( _P.sceneDataURL != null ){

          // fetch Scene Data
          $.getJSON( _P.sceneDataURL, function( data ){ _P.sceneData = data; });
        }

        if ( _P.gfx.background.path != null ){
          
          _P.gfx.background.image.onload = function() {

            _P.width = _P.gfx.background.image.width * ctxRatio;
            canvasUtils.proccesGfxToCanvas( _P.gfx.background, ctxRatio );
          }
          _P.gfx.background.image.src = _P.gfx.background.path;

        }
      }



// --- IMMUTABLE PUBLIC PROPERTIES --- //

      Object.defineProperty( this, 'offset', {
        enumerable : true,
        get : function(){ return _P.offset; },
        set : function(){ throw Error( 'Scene instance property "offset" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( this, 'width', {
        enumerable : true,
        get : function(){ return _P.width; },
        set : function(){ throw Error( 'Scene instance property "width" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( this, 'height', {
        enumerable : true,
        get : function(){ return _P.height; },
        set : function(){ throw Error( 'Scene instance property "height" can not be set directly. Use setter method.' ); }
      });



// --- PUBLIC SETTERS --- //

      this.setProp = function ( key, value ) {
        
        if ( typeof value === typeof _P[ key ] ){
          _P[ key ] = value;
        }
      }



// --- PUBLIC METHODS --- //

      this.update = function ( timeLapsed ) {
        
        var objects = _P.objects.animated,
            object;

        for ( var i = 0, len = objects; i < len; i++ ) {
            object = objects[ i ];
            object.update();
        }

        if ( io_CONTROL.isLeftMousePressed() ) {

          objects = _P.objects.actable;
          for ( var i = 0, len = objects; i < len; i++ ) {
          
            object = _P.objects.actable[ i ];  
            if ( io_CONTROL.getMousePosition.x > object.x - ( object.width / 2 )
              && io_CONTROL.getMousePosition.x < object.x + ( object.width / 2 )
              && io_CONTROL.getMousePosition.y > object.y - object.height
              && io_CONTROL.getMousePosition.y < object.y ) {
                _P.selection = object;
            }
          }
        }
      };

      this.addObject = function ( object, id, stack, isAnimated, isActable ) {

        if ( ! object || typeof id != 'string' || _P.objects.hash[ id ] ) return;

        _P.objects.hash[ id ] = object;

        if ( stack === 'foreground' ) {
          _P.objects.foreground.push( object );
        }

        else {
          _P.objects.background.push( object );
        }

        if ( isAnimated === true ) {
          _P.objects.animated.push( object );
        }

        if ( isActable === true ) {
          _P.objects.actable.push( object );
        }
      };

      this.removeObject = function ( ) {

      };

      this.getSelection = function () {
        return _P.selection;
      };

      this.resetSelection = function () {
        _P.selection = null;
      };

      this.getObjectData = function ( objectId, action ){

        var o = _P.sceneData[ objectId ];

        if ( o === undefined || o.action[ action ] === undefined ) return null;
        return o.action[ action ].slice(0);
      };

      this.drawBackground = function ( timeLapsed ){
        
        var objects = _P.objects.background,
            object;

        if ( _P.gfx.background.ready ) {
        
          CTX.drawImage(
            _P.gfx.background.canvas,
            0,
            0,
            _P.gfx.background.canvas.width,
            _P.gfx.background.canvas.height,
            0,
            0,
            _P.gfx.background.canvas.width * ctxRatio,
            _P.gfx.background.canvas.height * ctxRatio
          );
        }

        for ( var i = 0, len = objects.length; i < len; i++ ) {
          object = objects[ i ];
          object.draw();
        }
      };

      this.drawForeground = function ( timeLapsed ){
        
        var objects = _P.objects.foreground,
            object;

        for ( var i = 0, len = objects.length; i < len; i++ ) {
          object = objects[ i ];
          object.draw();
        }
      };

    } // end of CLASS

    return Scene;

  }
);