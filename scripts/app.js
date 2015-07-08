'use strict';

import PIXI   from 'pixijs';
import {Game} from 'game/module/Game';

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

window.GAME = new Game({
  menuCfgUrl:    './data/menu.json',
  playerCfgUrl:  './data/player.json',
  spritesCfgUrl: './data/sprites.json',
  scriptCfgUrl:  './data/scene/${sceneIndex}/_scripts.json',
  sceneCfgUrl:   './data/scene/${sceneIndex}/_scene.json'
});