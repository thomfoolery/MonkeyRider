'use strict';

import PIXI from 'pixi.js';
import Game from 'game/module/Game';

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

Game.init({
  spritesCfgUrl: './data/sprites.json',
  scriptCfgUrl:  './data/scene/${sceneIndex}/_scripts.json',
  sceneCfgUrl:   './data/scene/${sceneIndex}/_scene.json'
});