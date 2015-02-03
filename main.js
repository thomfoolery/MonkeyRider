'use strict';

import Game from 'app/Game';

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

var GAME = new Game({
  x: 0,
  y: 0,
  width: 400,
  height: 200,
  resolution: 3
});