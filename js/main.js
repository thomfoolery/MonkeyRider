"use strict";
/* Author: Thomas Yuill
 *
 *  the curse of
 *  MONKEY RIDER
 */

require.config({
  baseUrl: "js",
  paths: {
    'class': 'classes'
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
    "utils/scriptor",

    "class/scene",
    "class/player",
    "class/static",
    "class/sprite",
    "class/character"
  ],

  // CALLBACK
  function main ( io_SCREEN, io_CONTROL, ANIMATOR, SCRIPTOR, Scene, Player, Static, Sprite, Character ) {

    io_SCREEN.setup( {
      resolutions: {
        source: {
          x: 400,
          y: 225
        }
      }
    });

    io_CONTROL.setup( io_SCREEN );

    var ctx        = io_SCREEN.getContext(),
        ctx_ratio  = io_SCREEN.getMultiplier(),

        objectTypes  = {
          'Static':     Static,
          'Sprite':     Sprite,
          'Character':  Character
        },

        SCENE   = new Scene( {}, ctx, ctx_ratio, objectTypes, io_SCREEN, io_CONTROL ),
        PLAYER  = new Player( {}, ctx, ctx_ratio, io_CONTROL, SCENE, SCRIPTOR )

        ;

    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    SCENE.loadSceneData('/data/scene.1.json');

    ANIMATOR.draw = function( timeLapsed ){

      // draw
      if ( timeLapsed > 100 ) return;

      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      ctx.fillStyle = 'black';
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

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
