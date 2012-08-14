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
    
    function Player( properties, CTX, ctxRatio, io_CONTROL, SCENE ) {

      var _P = {

            x: 0,
            y: CTX.canvas.height,
            width:  0,
            height: 0,
            isDead: false,

            gfx: {
              image:        new Image(),
              path:         '/img/sprites/guybrush-walk.png',
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
                back:    2
              },

              talk: {
                speech: [],
                duration: 0,
                lapsed: 0
              }
            }
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
      }



// --- IMMUTABLE PUBLIC PROPERTIES --- //

      Object.defineProperty( this, 'x', {
        enumerable : true,
        get : function(){ return _P.x; },
        set : function(){ throw Error( 'Player instance property "x" can not be set directly. Use setter method.' ) }
      });
      Object.defineProperty( this, 'y', {
        enumerable : true,
        get : function(){ return _P.y; },
        set : function(){ throw Error( 'Player instance property "y" can not be set directly. Use setter method.' ) }
      });
      Object.defineProperty( this, 'width', {
        enumerable : true,
        get : function(){ return _P.width; },
        set : function(){ throw Error( 'Player instance property "width" can not be set directly. Use setter method.' ) }
      });
      Object.defineProperty( this, 'height', {
        enumerable : true,
        get : function(){ return _P.height; },
        set : function(){ throw Error( 'Player instance property "height" can not be set directly. Use setter method.' ) }
      });



// --- PUBLIC METHODS --- //

      this.update = function( timeLapsed ){



          // MOUSE
          if ( io_CONTROL.isLeftMousePressed() && io_CONTROL.getMousePosition() ) {

            _P.action.walk.destinationX = io_CONTROL.getMousePosition().x + ( SCENE.offset.x * -1 );
          }



          // KEYBOARD
          if ( io_CONTROL.isKeyPressed() ) {}
          else {}



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

            _P.action.walk.destinationX = null

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
          else if ( _P.action.walk.destinationX != null && _P.action.walk.destinationX != _P.x ) {

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
              
              _P.x                        = _P.action.walk.destinationX;
              _P.action.walk.destinationX = null;
              _P.animation                = 'stand';
              _P.index                    = _P.action.stand.idle;
              
              if ( SCENE.getSelection() != null ){

                if ( SCENE.getSelection().getStack() === 'foreground' ) {
                  _P.animation  = 'stand';
                  _P.index = _P.action.stand.front;
                }
                else {
                  _P.animation  = 'stand';
                  _P.index = _P.action.stand.back;
                }

                self.talk( SCENE.getObjectData( SCENE.getSelection(), 'look' ) );
                
                SCENE.resetSelection();
              }
            }
          }

          // WALK: stopped
          else if ( _P.animation === 'walk' && ! io_CONTROL.isKeyPressed('LEFT') && ! io_CONTROL.isKeyPressed('RIGHT') ) {
            _P.animation = 'stand';
            _P.index     = _P.action.stand.idle;
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

      this.talk = function( speech, duration ){

        if ( ! speech ){
          _P.action.talk.speech = [],
          _P.action.talk.duration = 0;
          _P.action.talk.lapsed = 0;
        }

        if ( $.isArray( speech ) ) {
          _P.action.talk.speech = speech;
        }
        else {
          _P.action.talk.speech = [ speech ];
        }

        _P.action.talk.duration = _P.action.talk.speech[0].length * 100;
        _P.action.talk.lapsed = 0;
      };

      this.die = function(){
        _P.isDead = true;
      };

      this.isDead = function(){
        return _P.isDead;
      };

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
            self.y - self.height,
            self.width,
            self.height
          );
        CTX.restore();

        // talk
        if ( _P.action.talk.speech.length ){

          if ( _P.action.talk.lapsed > _P.action.talk.duration ){
            _P.action.talk.speech.shift();
            _P.action.talk.lapsed = 0;
            if ( _P.action.talk.speech.length === 0 ) return;
          }
          else{
            _P.action.talk.lapsed += timeLapsed;
          }

          CTX.font = 'bold 12px Helvetica';
          CTX.fillStyle = 'white';
          CTX.fillText( _P.action.talk.speech[0], _P.x + ( self.width / 2 ), self.y - self.height );
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