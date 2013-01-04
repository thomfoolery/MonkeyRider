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
  'class/sprite.2',

  // DEPENDANCIES
  ['utils/canvas'],

  // CALLBACK
  function( canvasUtils ){

    function Sprite ( name, properties, CTX, ctxRatio, SCENE ){

      var _P = {

            name:       name,
            width:      CTX.canvas.width,
            height:     CTX.canvas.height,
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

            action: {

              talk: {
                speech: [],
                duration: 0,
                lapsed: 0,
                color: 'white'
              }
            },

            scriptor: null
          },

          self = this

          ;



      $.extend( true, _P, properties );
      _init();



// --- PRIVATE FUNCTIONS --- //

      function _init () {

        _P.width  = Math.round( _P.gfx.width  * ctxRatio * _P.gfx.scale );
        _P.height = Math.round( _P.gfx.height * ctxRatio * _P.gfx.scale );

        if ( _P.gfx.path != null ){

          _P.gfx.image.onload = function() {

            var imageData;

            canvasUtils.proccesGfxToCanvas( _P.gfx, ctxRatio );
          };

          _P.gfx.image.src = _P.gfx.path;
        }

        _P.x = _P.x * ctxRatio;
        _P.y = CTX.canvas.height - _P.y * ctxRatio;
      }



// --- IMMUTABLE PUBLIC PROPERTIES --- //

      Object.defineProperty( self, 'name', {
        enumerable : true,
        get : function(){ return _P.name; },
        set : function(){ throw Error( 'Sprite instance property "name" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'width', {
        enumerable : true,
        get : function(){ return _P.width; },
        set : function(){ throw Error( 'Sprite instance property "width" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'height', {
        enumerable : true,
        get : function(){ return _P.height; },
        set : function(){ throw Error( 'Sprite instance property "height" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'x', {
        enumerable : true,
        get : function(){ return _P.x; },
        set : function(){ throw Error( 'Sprite instance property "x" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'y', {
        enumerable : true,
        get : function(){ return _P.y; },
        set : function(){ throw Error( 'Sprite instance property "y" can not be set directly. Use setter method.' ); }
      });



// --- PUBLIC SETTERS --- //

      self.setProp = function ( key, value ) {

        if ( typeof value === typeof _P[ key ] ){
          _P[ key ] = value;
        }
      };



// --- PUBLIC METHODS --- //

      self.isMouseOver = function(){

        var x = Math.round( this.x + SCENE.offset.x )
          , MOUSE = SCENE.io_CONTROL.getMousePosition()
          ;

        if ( MOUSE.x > x
          && MOUSE.x < x + _P.width
          && MOUSE.y < _P.y
          && MOUSE.y > _P.y - _P.height ){

          return true;
        }

        return false;
      };

      self.getStack = function () {
        return _P.stack;
      };

      self.getScript = function ( action ) {
        return _P.scripts[ action ];
      }

      self.getDestinationOffset = function () {
        return _P.destinationOffset;
      }

      self.setState = function ( state, scriptor ) {

        if ( typeof state !== 'string') throw new Error ('Static object\'s setState() method accepts a string');
        if ( _.has( _P.states, state ) )
          _P.state = state;

        scriptor && scriptor.next();
      }


      this.setSpeech = function ( speech, scriptor ) {

        _P.action.talk.duration = Math.max( 1000, ( speech.length * 150 ) );
        _P.action.talk.speech = speech;
        _P.action.talk.lapsed = 0;
        _P.scriptor = scriptor;
      }

      this.speak = function( timeLapsed ){

        _P.action.talk.lapsed += timeLapsed;

        if ( _P.action.talk.lapsed > _P.action.talk.duration ) {
          _P.action.talk.speech = null;
          _P.scriptor.next();
        }
      };


      // UPDATE & DRAW



      self.update = function ( timeLapsed ) {

        if ( typeof _P.action.talk.speech === 'string') {
          self.speak( timeLapsed );
        }
      };

      self.draw = function( timeLapsed ){

        var offsetX = 0
          , offsetY = 0
          ;

        if ( ! _P.gfx.ready ) return;

        if ( _P.animation != undefined ) {
          // TO DO
        }
        else
        if ( _P.state != undefined ) {
          offsetX = _P.states[ _P.state ].sprite * _P.gfx.width;
        }

        CTX.drawImage(
          _P.gfx.canvas,
          offsetX,
          offsetY,
          _P.gfx.width,
          _P.gfx.height,
          _P.x,
          _P.y - self.height,
          self.width,
          self.height
        );

        // talk
        if ( typeof _P.action.talk.speech === 'string' ){

          var fontSize = Math.round( 5 * ctxRatio )
            , lines = _P.action.talk.speech.split('//')
            , line
            ;

          for ( var i = 0, len = lines.length; i < len; i++ ) {

            line = lines[ i ];

            CTX.font = 'bold ' + fontSize + 'px monospace';
            CTX.fillStyle = _P.action.talk.color;
            CTX.fillText( line, _P.x + self.width, self.y - self.height + ( fontSize * i ) + 2 );
          }
        }
      };

    } // end of CLASS

    return Sprite;

  }
);