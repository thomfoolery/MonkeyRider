/*
 * CONTROL INPUT MODULE (!) SINGLETON
 * ====================
 *
 * PUBLIC PROPERTIES
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
 *   getMousePosition ()          : OBJ
 *        x : INT
 *        y : INT
 *
 *   isLeftMousePressed ()        : BOOLEAN
 *   isRightMousePressed ()       : BOOLEAN
 *
 *   isKeyPressed ( key )         : BOOLEAN
 *
 */
define(

  // MODULE NAME
  'io/control',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {

    var MOUSE_X = 0,
        MOUSE_Y = 0,

        MOUSE_LEFT  = false,
        MOUSE_RIGHT = false,

        KEY_CODES = {
          UP:     [38,87],
          RIGHT:  [39,68],
          DOWN:   [40,83],
          LEFT:   [37,65]
        },

        KEY_PRESSED  = false,
        KEYS_PRESSED = {},

        io_SCREEN,
        $canvas,

        api

        ;

    // on mouse move
    $( window ).mousemove( function ( e ) {

      MOUSE_X = e.clientX;
      MOUSE_Y = e.clientY;
    });

    // mouse down
    $( window ).mousedown( function ( e ) {

      if ( api.getMousePosition() === null ) return;

      if ( e.which === 1 ){
        MOUSE_LEFT  = true;
        $.publish('/control/mouse/down/left');
      }
      else if ( e.which === 3 ){
        MOUSE_RIGHT = true;
        $.publish('/control/mouse/down/right');
      }
    });

    // mouse up
    $( window ).mouseup( function ( e ) {

      if ( e.which === 1 ){
        MOUSE_LEFT  = false;
        $.publish('/control/mouse/up/left');
      }
      else if ( e.which === 3 ){
        MOUSE_RIGHT = false;
        $.publish('/control/mouse/up/right');
      }
    });

    // on key down
    $( window ).keydown( function( e ) {

      KEY_PRESSED               = true;
      KEYS_PRESSED[ e.keyCode ] = true;

      if ( e.keyCode === KEY_CODES.UP           &&   KEYS_PRESSED[ KEY_CODES.DOWN ] ) { // UP while DOWN
        delete KEYS_PRESSED[ KEY_CODES.DOWN ];  e.preventDefault();
      }
      else if ( e.keyCode === KEY_CODES.RIGHT   &&   KEYS_PRESSED[ KEY_CODES.LEFT ] ) { // RIGHT while LEFT
        delete KEYS_PRESSED[ KEY_CODES.LEFT ];  e.preventDefault();
      }
      else if ( e.keyCode === KEY_CODES.DOWN    &&   KEYS_PRESSED[ KEY_CODES.UP ] ) { // DOWN while UP
        delete KEYS_PRESSED[ KEY_CODES.UP ];    e.preventDefault();
      }
      else if ( e.keyCode === KEY_CODES.LEFT    &&   KEYS_PRESSED[ KEY_CODES.RIGHT ] ) { // LEFT while RIGHT
        delete KEYS_PRESSED[ KEY_CODES.RIGHT ]; e.preventDefault();
      }
    });

    // on key up
    $( window ).keyup( function( e ) {

      if ( KEYS_PRESSED[ e.keyCode ] ) {
        delete KEYS_PRESSED[ e.keyCode ];
      }
      if ( Object.keys( KEYS_PRESSED ).length === 0 ) {
        KEY_PRESSED = false;
      }
    });



// --- PUBLIC METHODS --- //
    api = {

      setup: function ( _io_SCREEN ) {

        io_SCREEN = _io_SCREEN;
        $canvas = io_SCREEN.getCanvas();
      },

      getMousePosition: function () {

        var x, y;

        x = MOUSE_X - $canvas.offset().left;
        y = MOUSE_Y - $canvas.offset().top;

        return {
          'x': x,
          'y': y
        };
      },

      isLeftMousePressed: function () {
        return MOUSE_LEFT;
      },

      isRighttMousePressed: function () {
        return MOUSE_RIGHT;
      },

      isKeyPressed: function ( key ) {

        if ( key === undefined ){
          return KEY_PRESSED;
        }

        if ( typeof key === 'number' ) {
          if ( KEYS_PRESSED[ key ] ) {
            return false;
          }
          return false;
        }

        if ( typeof key != 'string' ) {
          return false;
        }

        key = key.toUpperCase();

        if ( KEY_CODES[ key ] ) {
          for ( var i in  KEY_CODES[ key ] ){
            if ( KEYS_PRESSED[ KEY_CODES[ key ][ i ] ] ) {
              return true;
            }
          }
        }
        return false;
      },

      releaseAll: function() {
        for ( var i in  KEYS_PRESSED ){
          delete KEYS_PRESSED[ i ];
        }
      }
    };



    // (!) RETURNS SINGLETON
    return api;
  }
);
