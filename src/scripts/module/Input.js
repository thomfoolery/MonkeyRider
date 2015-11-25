'use strict';

import _ from 'lodash';
import Game from 'game/module/Game';
import Messenger from 'event-aggregator';

const KEY_MAP = {
  "SELECT": 13,
  "LEFT":   37,
  "UP":     38,
  "RIGHT":  39,
  "DOWN":   40
};

var keysPressed = [];

var Input = {

  mode: 'play',

  // mouse = {
  //   position: new PIXI.Point( Game.viewport.width / 2, Game.viewport.height / 2 )
  // },

  get keysPressed () {
    return keysPressed.slice(0);
  },

  get keyMappings () {
    return KEY_MAP;
  },

  // onMouseMove ( interactionData ) {
  //   var position = interactionData.data.global;
  //   this.mouse.position.x = Math.round( position.x );
  // },


  // onMouseOut ( interactionData ) {
  //   this.mouse.position.x = Game.viewport.x + (Game.viewport.width / 2);
  // },

  onKeyDown ( e ) {
    keysPressed[ e.keyCode ] = true;
  },

  onKeyUp ( e ) {
    delete keysPressed[ e.keyCode ];
  },

  clear ( keyCode ) {
    delete keysPressed[ keyCode ];
  },

  destroy () {

  },

}

document.addEventListener('keydown', Input.onKeyDown.bind(Input) );
document.addEventListener('keyup',   Input.onKeyUp.bind(Input) );

// Game.stage.interactive = true;
// Game.stage.on('mousemove', Input.onMouseMove.bind( Input ));
// Game.stage.on('mouseout',  Input.onMouseOut.bind( Input ));

export default Input;