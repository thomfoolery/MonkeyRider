'use strict';

import _ from 'lodash';
import Scene from 'app/Scene';
import KeyInput from 'app/KeyInput';

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

var GAME = {
  view: {
    x: 0,
    y: 0,
    width: 400,
    height: 200,
    resolution: 3
  },
  scenes: []
};

var jsonLoader = new PIXI.JsonLoader('app/scene/1/_config.json');
jsonLoader.on('loaded', function( e ) {

  GAME.scenes[0] = { cfg: e.content.content.json };

  var key;
  var assets = [
    GAME.scenes[0].cfg.player.imageURL
  ];

  _.each( GAME.scenes[0].cfg, function ( cfg ) {
    _.each( cfg, function ( obj ) {
      if ( obj.imageURL )
        assets.push( obj.imageURL );
    });
  });

  var assetLoader = new PIXI.AssetLoader( assets );
  assetLoader.on('onComplete', assetsLoadComplete );
  assetLoader.on('onProgress', assetsLoadProgress );
  assetLoader.load();

});
jsonLoader.load();

var stage = new PIXI.Stage();
var renderer = new PIXI.autoDetectRecommendedRenderer( GAME.view.width, GAME.view.height, { resolution: GAME.view.resolution });
document.body.appendChild( renderer.view );

function assetsLoadProgress ( e ) {
  // console.log( e );
}

function assetsLoadComplete ( e ) {

  var scene = GAME.scene = new Scene( GAME.view, GAME.scenes[0].cfg, stage, KeyInput );
  requestAnimationFrame( animate );
}

var currDate  = new Date();
var prevDate  = new Date();
var timelapse;

function animate() {
  requestAnimationFrame( animate );

  currDate  = new Date();
  timelapse = currDate - prevDate;
  prevDate  = currDate;

  GAME.scene.update( timelapse );

  renderer.render( stage );
}