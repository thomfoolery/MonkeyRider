import _ from 'lodash';

import Scene    from 'app/Scene';
import Player   from 'app/Player';
import Director from 'app/Director';
import Controls from 'app/Controls';

class Game {

  constructor ( viewConfig ) {

    this.sceneIndex = 0;
    this.viewConfig = {
      x: 0,
      y: 0,
      width: 400,
      height: 200,
      resolution: 3
    };

    this.loadScene ();

  }

  loadScene () {

    var game         = this;
    var sceneIndex   = this.sceneIndex;
    var configLoader = new PIXI.JsonLoader('app/scene/' + sceneIndex + '/_config.json');
    var scriptLoader = new PIXI.JsonLoader('app/scene/' + sceneIndex + '/_script.json');
    var playerLoader = new PIXI.JsonLoader('app/character/guybrush/_config.json');

    configLoader.on('loaded', function( e ) {
      this.sceneConfig = e.content.content.json;
      onComplete();
    }.bind( this ));
    configLoader.load();

    scriptLoader.on('loaded', function( e ) {
      this.sceneScript = e.content.content.json;
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
        || ! game.sceneConfig
        || ! game.sceneScript )
        return;

      var assets = [
        game.playerCFG.imageURL
      ];

      _.each( game.sceneConfig, function ( cfg ) {
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

    this.stage    = new PIXI.Stage();
    this.renderer = new PIXI.autoDetectRecommendedRenderer( this.viewConfig.width, this.viewConfig.height, { resolution: this.viewConfig.resolution });
    document.body.insertBefore( this.renderer.view, document.body.firstChild );

    this.controls = new Controls(
      this,
      document.querySelector('#action-panel'),
      document.querySelector('#action-descriptor'),
      document.querySelector('#inventory-panel')
    );

    this.player   = new Player( this.playerCFG, this.controls );
    this.director = new Director( this.player, this.sceneScript, this.controls );

    this.player.addDirector( this.director );

    this.scene = new Scene(
      this.viewConfig,
      this.sceneConfig,
      this.sceneScript,
      this.stage,
      this.player,
      this.director,
      this.controls
    );

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
    this.director.update( timelapse );

    this.renderer.render( this.stage );

  }

}

export default Game;