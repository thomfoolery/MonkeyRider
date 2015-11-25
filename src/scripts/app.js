'use strict';

import PIXI from 'pixi.js';
import Game from 'game/module/Game';

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

Game.init({
  spritesCfgUrl: './data/sprites.json',
  scriptCfgUrl:  './data/scripts_${sceneIndex}.json',
  sceneCfgUrl:   './data/scene_${sceneIndex}.json'
});