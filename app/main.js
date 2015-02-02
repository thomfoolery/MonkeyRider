'use strict';

// import Utils from 'app/Utils';
// Utils.processTransparency('app/scene/1/bike.c.png');

import assets from 'app/assets';
import Scene from 'app/Scene';

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

var GAME = {};
var jsonLoader = new PIXI.JsonLoader('app/scene/1/config.json');
jsonLoader.on('loaded', function( e ) {

  GAME.data = e.content.content.json;

  var assetLoader = new PIXI.AssetLoader( assets );
  assetLoader.on('onComplete', assetsLoadComplete );
  assetLoader.on('onProgress', assetsLoadProgress );
  assetLoader.load();

});
jsonLoader.load();

var stage = new PIXI.Stage(0xeeeeee);
var renderer = new PIXI.autoDetectRecommendedRenderer( 400, 200, { resolution: 3 });
document.body.appendChild( renderer.view );

function assetsLoadProgress ( e ) {
  console.log( e );
}

function assetsLoadComplete ( e ) {

  var scene = GAME.scene = new Scene( stage );

  GAME.data.backgrounds.forEach( function ( cfg ) {
    scene.addBackground( cfg );
  });

  GAME.data.entities.forEach( function ( cfg ) {
    scene.addEntity( cfg );
  });

  GAME.player = scene.addEntity( GAME.data.player );

  requestAnimationFrame( animate );
}

var currDate  = new Date();
var prevDate  = new Date();
var timelapse = 0;

function animate() {
  requestAnimationFrame( animate );

  currDate = new Date();
  timelapse += currDate - prevDate;
  prevDate = currDate;

  if ( timelapse > 150 ) {
    GAME.player.update();
    timelapse = 0;
  }

  renderer.render( stage );
}

document.addEventListener('keydown', function ( e ) {

  // console.log( e.keyCode );

  if ( e.keyCode === 32 ) {
    if ( GAME.player.state == 'knocking' )
      GAME.player.state = 'standFacing';
    else
      GAME.player.state = 'knocking';
  }
  if ( e.keyCode === 37 ) {
    GAME.player.state = 'walking';
    GAME.player.dir = -1;
  }
  else if ( e.keyCode === 38 ) {
    GAME.player.state = 'standBacking';
  }
  else if ( e.keyCode === 39 ) {
    GAME.player.state = 'walking';
    GAME.player.dir = 1;
  }
  else if ( e.keyCode === 40 ) {
    GAME.player.state = 'standFacing';
  }

  GAME.player.currFrame = GAME.player.states[ GAME.player.state ].start;

});