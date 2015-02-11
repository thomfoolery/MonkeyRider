'use strict';

import _        from 'lodash';
import {Mover}    from 'game/module/Mover';
import {Scene}    from 'game/module/Scene';
import {Player}   from 'game/module/Player';
import {Speaker}  from 'game/module/Speaker';
import {Director} from 'game/module/Director';
import {Controls} from 'game/module/Controls';

import {EventAggregator} from 'aurelia-event-aggregator';

var resolveReady;

export class Game {

  constructor ( DOMcontainer, viewConfig, sceneConfig, editMode ) {

    this.ready = new Promise( resolve => { resolveReady = resolve; });

    this.DOMcontainer = DOMcontainer || document.querySelector('#game-container');

    this.viewConfig = viewConfig || {
      x: 0,
      y: 0,
      width: 400,
      height: 200,
      resolution: 3
    };

    this.sceneIndex = sceneConfig ? sceneConfig.meta.sceneIndex : 0;
    this.editMode   = editMode || false;

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

    var configLoader = new PIXI.JsonLoader('game_data/scene/' + sceneIndex + '/_config.json');
    this.assetLoaders.push( configLoader );
    configLoader.on('loaded', ( e ) => {
      this.sceneConfig = e.content.content.json;
      onComplete();
    });
    configLoader.load();

    var scriptLoader = new PIXI.JsonLoader('game_data/scene/' + sceneIndex + '/_script.json');
    this.assetLoaders.push( scriptLoader );
    scriptLoader.on('loaded', ( e ) => {
      this.sceneScript = e.content.content.json;
      onComplete();
    });
    scriptLoader.load();

    var playerLoader = new PIXI.JsonLoader('game_data/character/guybrush/_config.json');
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

    var assets = [];
    var game = this;

    if ( ! this.editMode )
      assets.push( this.playerCFG.imageURL );

    _.each( this.sceneConfig.gameObjects, ( cfg ) => {
      _.each( cfg, ( obj ) => {
        if ( obj.imageURL ) {
          obj.imageURL = 'game_data/scene/' + game.sceneIndex + '/' + obj.imageURL;
          assets.push( obj.imageURL );
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
    this.renderer = new PIXI.autoDetectRecommendedRenderer( this.viewConfig.width, this.viewConfig.height, { resolution: this.viewConfig.resolution });
    this.DOMcontainer.appendChild( this.renderer.view );

    this.messenger = new EventAggregator();

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

    resolveReady( this );

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

    if ( timelapse > 500 ) return; // exit;

    this.scene.update( timelapse );

    if ( ! this.editMode )
      this.director.update( timelapse );

    this.renderer.render( this.stage );

  }

}