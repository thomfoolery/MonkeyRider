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
  'class/scene',

  // DEPENDANCIES
  ['utils/canvas'],

  // CALLBACK
  function( canvasUtils ){

    function Scene ( properties, CTX, ctxRatio, objectTypes, io_SCREEN, io_CONTROL ){

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

          self = this

          ;



      $.extend( true, _P, properties );
      _init();



// --- PRIVATE FUNCTIONS --- //

      function _init ( PLAYER ) {

        if ( _P.sceneDataURL !== null ){

          // fetch Scene Data
          self.loadSceneData( _P.sceneDataURL );
        }

        // on selection
        $.subscribe('/control/mouse/up/left', function () {

          var objects = _P.objects.actable
            , object
            ;

          for ( var i = 0, len = objects.length; i < len; i++ ) {

            object = objects[ i ];
            if ( object.isMouseOver() ) {
              _P.PLAYER && _P.PLAYER.setSelection( object );
              break;
            }
            else if ( _P.PLAYER ) {
              _P.PLAYER.resetSelection();
            }
          }
        });
      }



// --- IMMUTABLE PUBLIC PROPERTIES --- //

      Object.defineProperty( self, 'offset', {
        enumerable : true,
        get : function(){ return _P.offset; },
        set : function(){ throw new Error( 'Scene instance property "offset" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'width', {
        enumerable : true,
        get : function(){ return _P.width; },
        set : function(){ throw new Error( 'Scene instance property "width" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'height', {
        enumerable : true,
        get : function(){ return _P.height; },
        set : function(){ throw new Error( 'Scene instance property "height" can not be set directly. Use setter method.' ); }
      });

      Object.defineProperty( self, 'io_SCREEN', {
        enumerable : true,
        get : function(){ return io_SCREEN; },
        set : function(){ throw new Error( 'Scene instance property "height" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'io_CONTROL', {
        enumerable : true,
        get : function(){ return io_CONTROL; },
        set : function(){ throw new Error( 'Scene instance property "height" can not be set directly. Use setter method.' ); }
      });

// --- PUBLIC SETTERS --- //

      self.setProp = function ( key, value ) {

        if ( typeof value === typeof _P[ key ] ){
          _P[ key ] = value;
        }
      };



// --- PUBLIC METHODS --- //

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

      self.loadSceneData = function ( URL, PLAYER ) {

        _P.sceneDataURL = URL;
        _P.PLAYER = PLAYER;

        $.getJSON( URL, function ( data ) {

          _P.sceneData = data;

          _P.width  = data.width * ctxRatio;
          _P.height = data.height * ctxRatio;

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
              canvasUtils.proccesGfxToCanvas( background, ctxRatio );
            };
            background.image.src = backgroundURL;

            _P.gfx.backgrounds.push( background );

          });

          // load objects
          $.each( data.objects, function ( index, object ) {
            self.addObject( object );
          });

        });
      };

      self.addObject = function ( def ) {

        var object
          , id = def.cfg.id;

        if ( ! def || typeof id !== 'string' ) return;
        if ( _P.objects.hash[ id ] !== undefined ) console.log('Object ' + id + ' is being overidden.' );


        object = new objectTypes[ def.type ]( def.cfg, CTX, self );

        _P.objects.hash[ id ] = object;

        if ( def.cfg.stack > 0 ) {
          _P.objects.foreground.push( object );
        }
        else {
          _P.objects.background.push( object );
        }

        if ( def.cfg.isAnimated === true ) {
          _P.objects.animated.push( object );
        }

        if ( def.cfg.isActable === true ) {
          _P.objects.actable.push( object );
        }
      };

      self.removeObject = function ( id ) {

      };

      self.getObjectScript = function ( id, action ){

        var obj     = _P.objects.hash[ id ]
          , script  = obj.getProperty('scripts.' + action )
          ;

        if ( obj === undefined || script === undefined ) return null;
        return script.slice(0);
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
              _P.gfx.backgrounds[ i ].canvas.width * ctxRatio,
              _P.gfx.backgrounds[ i ].canvas.height * ctxRatio
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