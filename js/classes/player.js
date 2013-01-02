/*
 * self MODULE
 * =============
 *
 * PUBLIC PROPERTIES --- (!) IMMUTABLE
 *------------------
 *
 *
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
  'class/player',

  // DEPENDANCIES
  ['utils/canvas'],

  // CALLBACK
  function ( canvasUtils ) {

    function Player( properties, CTX, ctxRatio, io_CONTROL, SCENE, SCRIPTOR ) {

      var _P = {

            name: 'player',

            x:      0,
            y:      0,
            width:  0,
            height: 0,
            isDead: false,

            gfx: {
              image:        new Image(),
              path:         '/img/sprites/guybrush-walk-3.png',
              width:  32,
              height: 48,
              ready:        false,
              canvas:       null,
              ctx:          null
            },

            animation:    'stand',
            index:        1,

            action: {

              walk: {
                destinationX: null,
                offsetX:      0,
                offsetY:      0,

                spriteCount:  6,

                index:        0,
                phase:        0,
                phaseLength:  14 * ctxRatio,

                direction:    1, // -1: left | 1: right
                speed:        90 * ctxRatio // px/sec
              },

              stand: {
                offsetX:      192,
                offsetY:      0,

                idle:    0,
                front:   1,
                back:    2,
                knock:   3
              },

              talk: {
                speech: [],
                duration: 0,
                lapsed: 0,
                color: '#ff00fc'
              }
            },

            script: null,
            scriptor: null
          },

          self = this

          ;



      $.extend( true, _P, properties );

      _init();



// --- PRIVATE FUNCTIONS --- //

      function _init () {

        _P.width  = Math.round( _P.gfx.width  * ctxRatio );
        _P.height = Math.round( _P.gfx.height * ctxRatio );

        _P.gfx.image.onload = function() {

            canvasUtils.proccesGfxToCanvas( _P.gfx, ctxRatio );
          }
        _P.gfx.image.src = _P.gfx.path;

        _P.action.walk.destinationX = _P.x;

        // on selection
        $.subscribe('/control/mouse/up/left', function () {

          if (     _P.selection === null &&
               (
                 ( ! _P.scriptor && io_CONTROL.getMousePosition() ) ||
                 (   _P.scriptor && _P.scriptor.isComplete() )
               )
             ) {

            self.walkTo( io_CONTROL.getMousePosition().x + ( SCENE.offset.x * -1 ) );
          }
        });
      }



// --- IMMUTABLE PUBLIC PROPERTIES --- //

      Object.defineProperty( self, 'name', {
        enumerable : true,
        get : function(){ return _P.name; },
        set : function(){ throw Error( 'Player instance property "name" can not be set directly. Use setter method.' ); }
      });
      Object.defineProperty( self, 'x', {
        enumerable : true,
        get : function(){ return _P.x; },
        set : function(){ throw Error( 'Player instance property "x" can not be set directly. Use setter method.' ) }
      });
      Object.defineProperty( self, 'y', {
        enumerable : true,
        get : function(){ return _P.y; },
        set : function(){ throw Error( 'Player instance property "y" can not be set directly. Use setter method.' ) }
      });
      Object.defineProperty( self, 'width', {
        enumerable : true,
        get : function(){ return _P.width; },
        set : function(){ throw Error( 'Player instance property "width" can not be set directly. Use setter method.' ) }
      });
      Object.defineProperty( self, 'height', {
        enumerable : true,
        get : function(){ return _P.height; },
        set : function(){ throw Error( 'Player instance property "height" can not be set directly. Use setter method.' ) }
      });



// --- PUBLIC METHODS --- //

      this.update = function( timeLapsed ){

          /*/ KEYBOARD
          if ( io_CONTROL.isKeyPressed() ) {}
          else {}*/

          // STAND: up & down
          if ( io_CONTROL.isKeyPressed('UP') ) {

            _P.animation  = 'stand';
            _P.index = _P.action.stand.back;
          }
          else if ( io_CONTROL.isKeyPressed('DOWN') ){

            _P.animation  = 'stand';
            _P.index = _P.action.stand.front;
          }

          // WALK: left & right
          else if ( io_CONTROL.isKeyPressed('LEFT') || io_CONTROL.isKeyPressed('RIGHT') ){

            _P.action.walk.destinationX = null;

            if ( _P.animation != 'walk' ) {
              _P.animation  = 'walk';
              _P.index = _P.action.walk.index;
            }

            if ( io_CONTROL.isKeyPressed('LEFT') ) {
              _P.action.walk.direction = -1;
            }

            else if ( io_CONTROL.isKeyPressed('RIGHT') ) {
              _P.action.walk.direction = 1;
            }

            self.walk( ( timeLapsed / 1000 ) * _P.action.walk.speed );
          }
          // WALK: to destination
          else if ( _P.action.walk.destinationX != null && _P.x != _P.action.walk.destinationX ) {

            if ( _P.animation != 'walk' ) {
              _P.animation = 'walk';
              _P.index     = _P.action.walk.index;
            }
            if ( _P.action.walk.destinationX > _P.x ) {
              _P.action.walk.direction = 1;
            }
            else {
              _P.action.walk.direction = -1;
            }

            var distance = ( timeLapsed / 1000 ) * _P.action.walk.speed;

            this.walk( distance );

            // WALK: to destination finished
            if ( Math.abs( _P.action.walk.destinationX - _P.x ) < distance ) {

              _P.x          = _P.action.walk.destinationX;
              _P.animation  = 'stand';
              _P.index      = _P.action.stand.idle;
            }
          }

          // WALK: stopped
          else if ( _P.animation === 'walk' && ! io_CONTROL.isKeyPressed('LEFT') && ! io_CONTROL.isKeyPressed('RIGHT') ) {
            _P.animation = 'stand';
            _P.index     = _P.action.stand.idle;
          }

          // DESTINATION REACHED
          if ( self.getSelection() && _P.x === _P.action.walk.destinationX &&
                ( _P.scriptor === null || _P.scriptor.isComplete() )
             ) {

            _P.action.walk.destinationX = null;

            if ( self.getSelection().getStack() > 0 ) {
              _P.animation  = 'stand';
              _P.index = _P.action.stand.front;
            }
            else {
              _P.animation  = 'stand';
              _P.index = _P.action.stand.back;
            }

            // SCRIPTING
            if ( _P.scriptor === null || _P.scriptor.isComplete() ) {
              _P.script = SCENE.getObjectScript( self.getSelection().name, 'look' );
              _P.scriptor = new SCRIPTOR( [ self, self.getSelection() ], _P.script, SCENE );
              _P.scriptor.next();
            }
          }

          // TALK
          if ( typeof _P.action.talk.speech === 'string' ) {
            self.speak( timeLapsed );
          }

          this.contain();
      };

      this.contain = function() {

            // left wall
        if ( _P.x < _P.width / 2 ) {

          _P.x = _P.width / 2;
          self.stopWalk();

        }
            // right wall
        if ( _P.x > SCENE.width - ( self.width / 2 ) ) {

          _P.x = SCENE.width - ( self.width / 2 );
          self.stopWalk();
        }
      };

      this.standIdle = function () {
        _P.animation  = 'stand';
        _P.index      = _P.action.stand.idle;
        _P.scriptor && _P.scriptor.next();
      }

      this.standFront = function () {
        _P.animation  = 'stand';
        _P.index      = _P.action.stand.front;
        _P.scriptor && _P.scriptor.next();
      }
      this.standBack = function () {
        _P.animation  = 'stand';
        _P.index      = _P.action.stand.back;
        _P.scriptor && _P.scriptor.next();
      }

      this.standKnock = function () {
        _P.animation  = 'stand';
        _P.index      = _P.action.stand.knock;
        _P.scriptor && _P.scriptor.next();
      }

      this.setDirection = function ( direction ) {
        _P.action.walk.direction = direction;
        _P.scriptor && _P.scriptor.next();
      }

      this.stopWalk = function() {

        io_CONTROL.releaseAll();

        _P.animation = 'stand';
        _P.index     = _P.action.stand.idle;

        _P.action.walk.destinationX = null;
        _P.action.walk.destinationX = null;
      };

      this.walk = function( distance ){

        _P.x                 += _P.action.walk.direction * distance;
        _P.action.walk.phase += distance;

        var quarter   = CTX.canvas.width / 4;
            min = Math.abs( SCENE.offset.x ) + quarter,
            max = Math.abs( SCENE.offset.x ) + ( quarter * 3 )
            ;

        if ( _P.action.walk.phase > _P.action.walk.phaseLength ) {
          _P.index++;
          _P.action.walk.phase = 0;
        }

        if ( _P.index >= _P.action.walk.spriteCount ) {
          _P.index = _P.action.walk.index;
        }


        if ( ( _P.action.walk.direction === -1 && _P.x < min && SCENE.offset.x < 0 )
          || ( _P.action.walk.direction === 1 && _P.x > max && Math.abs( SCENE.offset.x ) < SCENE.width - CTX.canvas.width ) ) {
            SCENE.setProp('offset', {
              x: ( SCENE.offset.x - _P.action.walk.direction * distance ),
              y: SCENE.offset.y
            });
        }
      };

      this.walkTo = function ( x ){

        if ( ! isNaN( parseInt( x ) ) ) {
          _P.action.walk.destinationX = x;
        }
      };

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

      this.die = function(){
        _P.isDead = true;
      };

      this.isDead = function(){
        return _P.isDead;
      };

      this.getSelection = function ( object ) {
        return _P.selection;
      };

      this.setSelection = function ( object ) {

        _P.selection = object;

        if ( object.getDestinationOffset() ) {
          self.walkTo( object.x + ( object.getDestinationOffset().x * ctxRatio ) );
        }
        else {
          self.walkTo( io_CONTROL.getMousePosition().x + ( SCENE.offset.x * -1 ) );
        }
      };

      this.resetSelection = function () {
        _P.selection = null;
      }

      this.draw = function( timeLapsed ){

        if ( ! _P.gfx.ready ) return;

        var anim = _P.action[ _P.animation ];

        // walk
        CTX.save();
        if ( _P.action.walk.direction < 0 ) {

          CTX.translate( _P.x * 2, 0 );
          CTX.scale( -1, 1 );
        }
          CTX.drawImage(
            _P.gfx.canvas,
            anim.offsetX + ( _P.index * _P.gfx.width ),
            anim.offsetY,
            _P.gfx.width,
            _P.gfx.height,
            _P.x - ( self.width / 2 ),
            CTX.canvas.height - self.y - self.height,
            self.width,
            self.height
          );
        CTX.restore();

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
            CTX.fillText( line, _P.x + ( self.width / 4 ), CTX.canvas.height - self.y - self.height + ( fontSize * i ) + 2 );
          }
        }
      };

      this.getBoundingBox = function(){

          var halfWidth = self.width / 2;
          return {
              x: ( _P.x - halfWidth ),
              y: ( self.y - self.height ),
              width: self.width,
              height: self.height
          };
      };
    } // end of CLASS

    return Player;

  }
);