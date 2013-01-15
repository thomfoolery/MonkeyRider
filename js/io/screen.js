/*
 * CANVAS CONTEXT (!) SINGLETON
 * ==============
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
  'io/screen',

  // DEPENDANCIES
  [],

  // CALLBACK
  function Screen () {

    var _P = {

          resolutions: {

            source: {
              x: 400,
              y: 225,
              ratio: 1
            },

            destination: {
              x: 0,
              y: 0,
              ratio: 1
            }
          },

          border: 20,
          ctxRatio: 1

        },

        $canvas = $('<canvas>').prependTo( document.body ),
        ctx     = $canvas[0].getContext('2d')

        ;

// --- PRIVATE FUNCTIONS --- //

    function resize() {

      var xRatio = ( $( window ).outerWidth()  - ( _P.border * 2 ) ) / _P.resolutions.source.x
        , yRatio = ( $( window ).outerHeight() - ( _P.border * 2 ) ) / _P.resolutions.source.y
          ;

      _P.ctxRatio = ctx.ratio = Math.floor( Math.min( xRatio, yRatio ) * 10 ) / 10; // round down to 10th of a decimal

      ctx.canvas.width  = _P.resolutions.destination.x   = Math.floor( _P.resolutions.source.x * _P.ctxRatio );
      ctx.canvas.height = _P.resolutions.destination.y   = Math.floor( _P.resolutions.source.y * _P.ctxRatio );

      $canvas.css('marginLeft', ( $( window ).outerWidth() - $canvas.outerWidth() )  / 2 );
      $canvas.css('marginTop', ( $( window ).outerHeight() - $canvas.outerHeight() ) / 2 );
    }

    function createChoiceBubble ( choices, scriptor ) {

      var $bubble = $('<ul class="choice-bubble"/>')
        , $li
          ;

      $.each( choices, function ( choice, script, position ) {

        $li = $('<li data-script="' + script + '">' + choice.replace('//', '' ) + '</li>');
        $li.click( function( e ) {
          scriptor.getActor('player')[0].setSpeech( choice, scriptor );
          scriptor.loadScript( script );
          $bubble.remove();
        });
        $bubble.append( $li );
      });

      $bubble.insertAfter( $canvas )
        .css({
          "position": 'absolute',
          "left": parseInt( $canvas.css('marginLeft'), 10 ) + position.x,
          "top": parseInt( $canvas.css('marginTop'), 10 ) + ctx.canvas.height - position.y - $bubble.height() - 10
        })
      ;
    }


// (!) RETURNS SINGLETON
// --- PUBLIC METHODS --- //

    return {

      "setup": function ( properties ) {

        $.extend( true, _P, properties );

        ctx.player = {};
        ctx.scene = {};

        //$( window ).resize( resize );

        resize();
      },

      "createChoiceBubble": createChoiceBubble,

      "getCanvas": function () {
        return $canvas;
      },

      "getContext": function () {
        return ctx;
      },

      "getMultiplier": function () {
        return _P.ctxRatio;
      },

      "setCursor": function( type ){
        $canvas.css('cursor', type );
      },

      "resetCursor": function(){
        $canvas.css('cursor', 'crosshair');
      }
    }
  }
);
