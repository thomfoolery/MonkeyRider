'use strict';

import PIXI   from 'pixijs';
import {Game} from 'game/module/Game';

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

window.GAME = new Game({
  spriteJsonUrl:   './data/sprites.json',
  playerCfgUrl:    './data/player.json',
  menuCfgUrl:      './data/menu.json',
  sceneCfgUrl:     './data/scene/${sceneIndex}/_config.json',
  scriptUrl:       './data/scene/${sceneIndex}/_script.json'
});