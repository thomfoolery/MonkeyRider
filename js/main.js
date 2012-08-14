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

    "class/scene",
    "class/player",
    "class/static",
    "class/sprite",
    "class/character"
  ],

  // CALLBACK
  function main ( io_SCREEN, io_CONTROL, ANIMATOR, Scene, Player, Static, Sprite, Character ) {
    
    io_SCREEN.setup( {
      resolutions: {
        source: {
          x: 400,
          y: 225
        }
      }
    });

    io_CONTROL.setup( io_SCREEN.getCanvas() );

    var ctx        = io_SCREEN.getContext(),
        ctx_ratio  = io_SCREEN.getMultiplier(),

        SCENE   = new Scene( {}, ctx, ctx_ratio, io_CONTROL ),
        PLAYER  = new Player( {}, ctx, ctx_ratio, io_CONTROL, SCENE )

        ;

    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    SCENE.addObject( 
      new Static( {
        x: 237,
        y: SCENE.height,
        gfx:{
          path:     '/img/sprites/bike.png',
          darkenBy: .25,
          scale: .8
        }
      }, ctx, ctx_ratio ),

      'bike2', 'background', false, true
    );

    SCENE.addObject( 
      new Static( {
        x: 252,
        y: SCENE.height,
        gfx:{
          path: '/img/sprites/bike.png',
          darkenBy: .2,
          scale: .98
        }
      }, ctx, ctx_ratio ),

      'bike3', 'background', false, true
    );

    SCENE.addObject( 
      new Static( {
        x: 300,
        y: SCENE.height,
        gfx:{
          path:     '/img/sprites/bld-bar.png'
        }
      }, ctx, ctx_ratio ),

      'bar', 'background', false, false
    );

    SCENE.addObject( 
      new Static( {
        x: 400,
        y: SCENE.height,
        gfx:{
          path:     '/img/sprites/door.png'
        }
      }, ctx, ctx_ratio ),

      'door', 'background', false, false
    );

    SCENE.addObject( 
      new Static( {
        x: 200,
        y: SCENE.height,
        gfx:{
          path:     '/img/sprites/bike.png'
        }
      }, ctx, ctx_ratio ),

      'bike1', 'foreground', false, true
    );



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
        if ( SCENE.offset.x != 0 ){
          ctx.translate( SCENE.offset.x, 0 );
        }

        SCENE.drawBackground( timeLapsed );
        PLAYER.draw( timeLapsed );
        SCENE.drawForeground( timeLapsed );
      /* -- */
      ctx.restore();
    }

    ANIMATOR.start();
  }
);
