'use strict';

import _          from 'lodash';
import {Mover}    from 'game/module/Mover';
import {Scene}    from 'game/module/Scene';
import {Player}   from 'game/module/Player';
import {Speaker}  from 'game/module/Speaker';
import {Director} from 'game/module/Director';
import {Controls} from 'game/module/Controls';

import {EventAggregator} from 'aurelia-event-aggregator';

export class Game {

  constructor ( DOMcontainer, viewport, sceneConfig, editMode ) {

    this.DOMcontainer = DOMcontainer || document.querySelector('#game-container');

    this.viewport = viewport || {
      x: 0,
      y: 0,
      width: 400,
      height: 200,
      resolution: 3
    };

    this.editMode   = editMode || false;
    this.sceneIndex = sceneConfig ? sceneConfig.meta.sceneIndex : 0;
    this.messenger  = new EventAggregator();

    this.loadSceneData( sceneConfig );

  }

  loadSceneData ( sceneConfig ) {

    if ( this.editMode && sceneConfig ) {
      this.sceneConfig = sceneConfig;
      this.loadAssets();
      return;
    }

    this.assetLoaders = [];
    var sceneIndex    = this.sceneIndex;

    var configLoader = new PIXI.JsonLoader('/game_data/scene/' + sceneIndex + '/_config.json');
    this.assetLoaders.push( configLoader );
    configLoader.on('loaded', ( e ) => {
      this.sceneConfig = e.content.content.json;
      onComplete();
    });
    configLoader.load();

    var scriptLoader = new PIXI.JsonLoader('/game_data/scene/' + sceneIndex + '/_script.json');
    this.assetLoaders.push( scriptLoader );
    scriptLoader.on('loaded', ( e ) => {
      this.sceneScript = e.content.content.json;
      onComplete();
    });
    scriptLoader.load();

    var playerLoader = new PIXI.JsonLoader('/game_data/player.json');
    this.assetLoaders.push( playerLoader );
    playerLoader.on('loaded', ( e ) => {
      this.playerCFG = e.content.content.json;
      onComplete();
    });
    playerLoader.load();

    var onComplete = e => {

      var complete = true;
      this.assetLoaders.forEach( loader => {
        if ( ! loader.loaded ) complete = false;
      });

      if ( ! complete ) return;

      this.loadAssets();

    };

  }

  loadAssets () {

    var assets = ['/game_data/sprites.json'];
    var game = this;

    _.each( this.sceneConfig.gameObjects, ( categories, category ) => {
      _.each( categories, ( obj ) => {
        if ( obj.imageUrl ) {
          assets.push( obj.imageUrl );
        }
      });
    });

    var assetLoader = new PIXI.AssetLoader( assets );
    assetLoader.on('onComplete', this.onAssetsLoadComplete.bind( this ) );
    assetLoader.on('onProgress', this.onAssetsLoadProgress.bind( this ) );
    assetLoader.load();

  }

  onAssetsLoadProgress ( e ) {}

  onAssetsLoadComplete () {

    this.stage    = new PIXI.Stage();
    this.renderer = new PIXI.autoDetectRecommendedRenderer( this.viewport.width, this.viewport.height, { resolution: this.viewport.resolution });
    this.DOMcontainer.appendChild( this.renderer.view );

    if ( ! this.editMode ) {

      this.player = new Player( this.playerCFG, this );

      this.controls = new Controls(
        this,
        document.querySelector('#action-panel'),
        document.querySelector('#action-descriptor'),
        document.querySelector('#inventory-panel')
      );

      this.director  = new Director( this );
      this.speaker   = new Speaker( this );
      this.mover     = new Mover( this );

      this.player.addDirector( this.director );
    }

    this.scene = new Scene( this );

    this.animate.currDate = new Date();
    this.animate.prevDate = new Date();
    requestAnimationFrame( this.animate.bind( this ) );

  }

  animate () {

    var timelapse;

    requestAnimationFrame( this.animate.bind( this ) );

    this.animate.currDate = new Date();
    timelapse = this.animate.currDate - this.animate.prevDate;
    this.animate.prevDate = this.animate.currDate;

    if ( timelapse > 300 ) return; // exit;

    this.scene.update( timelapse );

    if ( ! this.editMode )
      this.director.update( timelapse );

    this.renderer.render( this.stage );

  }

  destroy () {

    this.stage.removeStageReference();

    this.messenger.
    this.renderer.destroy();
    this.controls.destroy();
    this.director.destroy();
    this.speaker.destroy();
    this.player.destroy();
    this.mover.destroy();
    this.scene.destroy();

    delete this;

  }

}