"use strict";
/* Author: Thomas Yuill
 *
 *  the curse of
 *  MONKEY RIDER
 */

require.config({
  baseUrl: "js",
  paths: {
    'object': 'objects',
    'module': 'modules',
    'extension': 'extensions'
  }
});

define(

  // MODULE NAME
  'main',

  // DEPENDANCIES
  [
    "io/screen",
    "io/control",

    "utils/animator",

    "module/scene",
    "module/player"
  ],

  // CALLBACK
  function main ( io_SCREEN, io_CONTROL, ANIMATOR, Scene, Player ) {

    io_SCREEN.setup( {
      resolutions: {
        source: {
          x: 400,
          y: 225
        }
      }
    });

    io_CONTROL.setup( io_SCREEN );

    var ctx     = io_SCREEN.getContext(),

        PLAYER  = new Player( io_SCREEN, io_CONTROL ),
        SCENE   = new Scene( io_SCREEN, io_CONTROL )

        ;

    ctx.player  = PLAYER;
    ctx.scene   = SCENE;

    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    PLAYER.setup();
    SCENE.setup('data/scene.1.json');

    ANIMATOR.draw = function( timeLapsed ){

      // draw
      if ( timeLapsed > 100 ) return;

      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      ctx.width  = ctx.width;//fillStyle = 'black';
      ctx.height = ctx.height;//fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      SCENE.update( timeLapsed );
      PLAYER.update( timeLapsed );

      ctx.save();
      /* -- */
        if ( SCENE.offset.x !== 0 ){
          ctx.translate( SCENE.offset.x, 0 );
        }

        SCENE.drawBackground( timeLapsed );
        PLAYER.draw( timeLapsed );
        SCENE.drawForeground( timeLapsed );
      /* -- */
      ctx.restore();
    };

    ANIMATOR.start();
  }
);
