import _ from 'lodash';

import Scene    from 'app/Scene';
import Player   from 'app/Player';
import Scriptor from 'app/Scriptor';
import KeyInput from 'app/KeyInput';

class Game {

  constructor ( viewConfig ) {

    this.viewConfig = viewConfig;

    this.scenes = [];
    this.currScene = null;
    this.currSceneIndex = 0;

    // begin
    this.load ( this.currSceneIndex );

  }

  load ( sceneIndex ) {

    this.currSceneIndex = sceneIndex;
    this.scenes[ sceneIndex ] = this.currScene = {};

    var game = this;
    var configLoader = new PIXI.JsonLoader('app/scene/' + sceneIndex + '/_config.json');
    var scriptLoader = new PIXI.JsonLoader('app/scene/' + sceneIndex + '/_script.json');
    var playerLoader = new PIXI.JsonLoader('app/character/guybrush/_config.json');

    configLoader.on('loaded', function( e ) {
      this.currScene.config = e.content.content.json;
      onComplete();
    }.bind( this ));
    configLoader.load();

    scriptLoader.on('loaded', function( e ) {
      this.currScene.script = e.content.content.json;
      onComplete();
    }.bind( this ));
    scriptLoader.load();

    playerLoader.on('loaded', function( e ) {
      this.playerCFG = e.content.content.json;
      onComplete();
    }.bind( this ));
    playerLoader.load();

    function onComplete () {

      if ( ! game.playerCFG
        || ! game.scenes[ sceneIndex ].config
        || ! game.scenes[ sceneIndex ].script )
        return;

      var assets = [
        game.playerCFG.imageURL
      ];

      _.each( game.currScene.config, function ( cfg ) {
        _.each( cfg, function ( obj ) {
          if ( obj.imageURL ) {
            obj.imageURL = 'app/scene/' + sceneIndex + '/' + obj.imageURL;
            assets.push( obj.imageURL );
          }
        });
      });

      game.loadAssets( assets );

    }

  }

  loadAssets ( assets ) {

    var assetLoader = new PIXI.AssetLoader( assets );
    assetLoader.on('onComplete', this.onAssetsLoadComplete.bind( this ) );
    assetLoader.on('onProgress', this.onAssetsLoadProgress.bind( this ) );
    assetLoader.load();

  }

  onAssetsLoadProgress ( e ) {}

  onAssetsLoadComplete () {

    var stage    = this.stage    = new PIXI.Stage();
    var renderer = this.renderer = new PIXI.autoDetectRecommendedRenderer( this.viewConfig.width, this.viewConfig.height, { resolution: this.viewConfig.resolution });
    document.body.insertBefore( renderer.view, document.body.firstChild );

    var player = this.player = new Player( this.playerCFG, KeyInput );

    var scriptor = this.scriptor = new Scriptor(
      player,
      this.currScene.script,
      document.querySelector('#action-panel'),
      document.querySelector('#action-descriptor'),
      document.querySelector('#inventory-panel')
    );

    var scene = this.scene = new Scene(
      this.viewConfig,
      this.currScene.config,
      this.currScene.script,
      stage,
      player,
      scriptor,
      KeyInput
    );

    player.addScriptor( scriptor );

    this.animate.currDate = new Date();
    this.animate.prevDate = new Date();
    requestAnimationFrame( this.animate.bind( this ) );
  }

  animate () {

    var timelapse

    requestAnimationFrame( this.animate.bind( this ) );

    this.animate.currDate = new Date();
    timelapse = this.animate.currDate - this.animate.prevDate;
    this.animate.prevDate = this.animate.currDate;

    if ( timelapse > 500 ) return; // exit;

    this.scene.update( timelapse );
    this.scriptor.update( timelapse );
    this.renderer.render( this.stage );

  }

}

export default Game;