'use strict';

import _         from 'lodash';
import Messenger from 'event-aggregator';

var G;

export class Input {

  constructor ( game ) {

    G = game;

    this.mode = 'player';

    this.keys = [];

    this.KEY = {
      "SELECT": 13,
      "LEFT":   37,
      "UP":     38,
      "RIGHT":  39,
      "DOWN":   40
    }

    document.addEventListener('keydown', this.onKeyDown.bind(this) );
    document.addEventListener('keyup',   this.onKeyUp.bind(this) );

    // G.stage.interactive = true;
    // G.stage.on('mousemove', this.onMouseMove.bind( this ));
    // G.stage.on('mouseout',  this.onMouseOut.bind( this ));

    // this.mouse = {
    //   position: new PIXI.Point( G.viewport.width / 2, G.viewport.height / 2 )
    // };

  }

  // onMouseMove ( interactionData ) {

  //   var position = interactionData.data.global;
  //   this.mouse.position.x = Math.round( position.x );

  // }


  // onMouseOut ( interactionData ) {

  //   this.mouse.position.x = G.viewport.x + (G.viewport.width / 2);

  // }

  onKeyDown ( e ) {
    this.keys[ e.keyCode ] = true;
  }

  onKeyUp ( e ) {
    delete this.keys[ e.keyCode ];
  }

  clear ( keyCode ) {
    delete this.keys[ keyCode ];
  }

  destroy () {

  }

}