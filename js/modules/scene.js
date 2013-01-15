"use strict";
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
  'module/scene',

  // DEPENDANCIES
  [
    'utils/canvas',
    'module/factory'
  ],

  // CALLBACK
  function( canvasUtils, Factory ){

    function Scene ( io_SCREEN, io_CONTROL ){

      var _P = {

            width:         0,
            height:        0,
            offset:        {
              x: 0,
              y: 0
            },

            sceneDataURL:  null,
            sceneData :    {},

            gfx: {
              backgrounds: []
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

          CTX,
          PLAYER,

          self = this

          ;


      _init();


// --- PRIVATE FUNCTIONS --- //

      function _init () {

        CTX = io_SCREEN.getContext();

        _P.width  = CTX.canvas.width;
        _P.height = CTX.canvas.height;

        Factory.init( CTX, self );

      }

// --- IMMUTABLE PUBLIC PROPERTIES --- //

      Object.defineProperties( self,
        {
          'offset': {
            enumerable : true,
            get : function(){ return _P.offset; },
            set : function(){ throw new Error( 'Scene.offset is immutable' ); }
          },
          'width': {
            enumerable : true,
            get : function(){ return _P.width; },
            set : function(){ throw new Error( 'Scene.width" is immutable' ); }
          },
          'height': {
            enumerable : true,
            get : function(){ return _P.height; },
            set : function(){ throw new Error( 'Scene.height is immutable' ); }
          },
          'io_SCREEN': {
            enumerable : true,
            get : function(){ return io_SCREEN; },
            set : function(){ throw new Error( 'Scene.io_SCREEN is immutable' ); }
          },
          'io_CONTROL': {
            enumerable : true,
            get : function(){ return io_CONTROL; },
            set : function(){ throw new Error( 'Scene.io_CONTROL is immutable' ); }
          }
        }
      );

// --- PUBLIC METHODS --- //

      this.setup = function ( URL ) {

        PLAYER = io_SCREEN.getContext().player;

        self.loadSceneData( URL );

        // on selection
        $.subscribe('/control/mouse/up/left', function () {

          var objects = _P.objects.actable
            , object
            ;

          for ( var i = 0, len = objects.length; i < len; i++ ) {

            object = objects[ i ];
            if ( object.isMouseOver() ) {
              PLAYER && PLAYER.setSelection( object );
              break;
            }
            else if ( PLAYER ) {
              PLAYER.resetSelection();
            }
          }
        });
      };

      self.loadSceneData = function ( URL ) {

        _P.sceneDataURL = URL;

        $.getJSON( URL, function ( data ) {

          _P.sceneData = data;

          _P.width  = data.width * CTX.ratio;
          _P.height = data.height * CTX.ratio;

          // load backgrounds
          $.each( data.backgrounds, function ( index, backgroundURL ) {

            var background = {
                  image:    new Image(),
                  path:     backgroundURL,
                  ready:    false,
                  canvas:   null,
                  ctx:      null
                }
                ;

            background.image.onload = function () {
              canvasUtils.proccesGfxToCanvas( background, CTX.ratio );
            };
            background.image.src = backgroundURL;

            _P.gfx.backgrounds.push( background );

          });

          // load objects
          $.each( data.objects, function ( index, object ) {
            self.addObject( Factory.create( object ) );
          });

        });
      };

      self.addObject = function ( object ) {

        var id = object.getProperty('id')
          , stack = object.getProperty('stack')
          , isActable = object.getProperty('isActable')
          , isAnimated = object.getProperty('isAnimated')
          ;

        _P.objects.hash[ id ] = object;

        if ( stack > 0 ) {
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

      self.removeObject = function ( id ) {

      };

      self.setOffset = function ( offset ) {
        _P.offset = offset;
      };

      self.update = function ( timeLapsed ) {

        var objects,
            object;

        objects = _P.objects.actable;
        for ( var i = 0, len = objects.length; i < len; i++ ) {
          object = objects[ i ];
          if ( object.isMouseOver() ) {
            io_SCREEN.setCursor('pointer');
            break;
          }
          io_SCREEN.resetCursor();
        };

        objects = _.toArray( _P.objects.hash );
        for ( var i = 0, len = objects.length; i < len; i++ ) {
          object = objects[ i ];
          object.update( timeLapsed );
        }
      };

      self.drawBackground = function ( timeLapsed ){

        var objects = _P.objects.background,
            object;

        // draw backgrounds
        for ( var i = 0, len = _P.gfx.backgrounds.length; i < len; i ++ ) {
          if ( _P.gfx.backgrounds[ i ].ready ) {
            CTX.drawImage(
              _P.gfx.backgrounds[ i ].canvas,
              0,
              0,
              _P.gfx.backgrounds[ i ].canvas.width,
              _P.gfx.backgrounds[ i ].canvas.height,
              ( _P.offset.x * -1 ) + ( _P.offset.x * .1 / len * i ),
              0,
              _P.gfx.backgrounds[ i ].canvas.width * CTX.ratio,
              _P.gfx.backgrounds[ i ].canvas.height * CTX.ratio
            );
          }
        }

        // draw objects
        for ( var i = 0, len = objects.length; i < len; i++ ) {
          object = objects[ i ];
          object.draw();
        }
      };

      self.drawForeground = function ( timeLapsed ){

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