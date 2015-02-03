'use strict';

import Game from 'app/Game';

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

var gameCFG = {
  x: 0,
  y: 0,
  width: 400,
  height: 200,
  resolution: 3
};

var GAME = new Game( gameCFG );