/*
 * REQUEST ANIMATION FRAME (!) SINGLETON
 * =======================
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
    start()

    stop()

    draw()

 *
 */
define(

  // MODULE NAME
  'utils/animator',

  // DEPENDANCIES
  [],

  // CALLBACK
  function() {

    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'];

    for( var x = 0; x < vendors.length && ! window.requestAnimationFrame; ++x ) {

        window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }

    if ( ! window.requestAnimationFrame ){

        window.requestAnimationFrame = function( callback, element ) {

            var currTime	= new Date().getTime(),
                timeToCall	= Math.max( 0, 16 - ( currTime - lastTime ) ),
                id			= window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall );

            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if ( ! window.cancelAnimationFrame ) {

        window.cancelAnimationFrame = function( id ) {

            clearTimeout( id );
        };
    }

    var time,
        lastTime                = ( new Date() ).getTime(),
        timeLapsed,
        isAnimating             = false,
        isAnimationRendering    = false,

        ANIMATOR

        ;

    // LOOP
    function LOOP () {

        if ( isAnimating ) { // Only draw if we are animating

            isAnimationRendering = true;

            time = ( new Date ).getTime();
            timeLapsed = time - lastTime;

            try {

                ANIMATOR.draw( timeLapsed ); // function defined elsewhere which draws animated elements
                lastTime = time;
            }
            catch (e) { console.log( e.stack ); debugger; }

            requestAnimationFrame( LOOP );
            isAnimationRendering = false;
        }
    }

    /* ANIMATION LOOP
    *
    *  start: 		function
    *  stop: 		function
    *  draw: 		function
    * */
    ANIMATOR = {

        start: function () { // START ANIMATION

            isAnimating = true;

            if ( ! isAnimationRendering ) {
                LOOP();
            }
        },

        stop: function () { // STOP ANIMATION

            isAnimating = false;
        },

        draw: function () {} // DRAW A SINGLE FRAME

    }

    return ANIMATOR;
  }
);
