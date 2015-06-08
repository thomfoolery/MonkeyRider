'use strict';

import _          from 'lodash';
import {Menu}     from 'game/module/Menu';
import {Input}    from 'game/module/Input';
import {Mover}    from 'game/module/Mover';
import {Scene}    from 'game/module/Scene';
import {Player}   from 'game/module/Player';
import {Speaker}  from 'game/module/Speaker';
import {Director} from 'game/module/Director';
import Messenger  from 'event-aggregator';

var playerCFG;
var sceneCFG;
var menuCfg;
var script;
var Opts;

export class Game {

  constructor ( options ) {

    Opts = options;

    this.DOMcontainer = document.querySelector('#game-container');

    this.viewport = {
      x: 0,
      y: 0,
      width: 480,
      height: 270,
      resolution: 4
    };

    this.messenger = new Messenger.EventAggregator();

    this.load();

  }

  load () {

    var self = this;
    var sceneIndex = this.sceneIndex || 0;

    this.assetLoaders = [];

    var playerCfgLoader = new PIXI.loaders.Loader();
    playerCfgLoader.add('player.json', Opts.playerCfgUrl );
    playerCfgLoader.on('complete', ( loader, resource ) => {
      playerCFG = resource['player.json'].data;
      onComplete();
    });
    this.assetLoaders.push( playerCfgLoader );
    playerCfgLoader.load();

    var sceneCfgLoader = new PIXI.loaders.Loader();
    sceneCfgLoader.add('config.json', Opts.sceneCfgUrl.replace('${sceneIndex}', sceneIndex ) );
    sceneCfgLoader.on('complete', ( loader, resource ) => {
      sceneCFG = resource['config.json'].data;
      onComplete();
    });
    this.assetLoaders.push( sceneCfgLoader );
    sceneCfgLoader.load();

    var menuCfgLoader = new PIXI.loaders.Loader();
    menuCfgLoader.add('menu.json', Opts.menuCfgUrl );
    menuCfgLoader.on('complete', ( loader, resource ) => {
      menuCfg = resource['menu.json'].data;
      onComplete();
    });
    this.assetLoaders.push( menuCfgLoader );
    menuCfgLoader.load();

    var scriptLoader = new PIXI.loaders.Loader();
    scriptLoader.add('script.json', Opts.scriptUrl.replace('${sceneIndex}', sceneIndex ) );
    scriptLoader.on('complete', ( loader, resource ) => {
      script = resource['script.json'].data;
      onComplete();
    });
    this.assetLoaders.push( scriptLoader );
    scriptLoader.load();

    var spriteLoader = new PIXI.loaders.Loader();
    spriteLoader.add('sprite.json', Opts.spriteJsonUrl );
    spriteLoader.on('complete', ( loader, resource ) => {
      onComplete();
    })
    this.assetLoaders.push( spriteLoader );
    spriteLoader.load();

    var onComplete = e => {

      var complete = true;
      self.assetLoaders.forEach( loader => {
        if ( loader.progress != 100 ) complete = false;
      });
      if ( ! complete ) return;
      self.onAssetsLoadComplete();

    };

  }

  onAssetsLoadComplete () {

    sceneCFG.height = this.viewport.height - menuCfg.height;

    this.stage    = new PIXI.Container();
    this.renderer = new PIXI.autoDetectRenderer( this.viewport.width, this.viewport.height, { resolution: this.viewport.resolution });

    this.input    = new Input( this );
    this.mover    = new Mover( this );
    this.speaker  = new Speaker( this );
    this.director = new Director( this );

    this.player   = new Player( playerCFG, this );
    this.scene    = new Scene( this, sceneCFG );
    this.menu     = new Menu ( this, menuCfg );

    this.scene.addSprite( this.player );

    this.animate.prevDate = Date.now();
    requestAnimationFrame( this.animate.bind( this ) );
    this.DOMcontainer.appendChild( this.renderer.view );

  }

  animate () {

    var timelapse;

    requestAnimationFrame( this.animate.bind( this ) );

    this.animate.currDate = Date.now();
    timelapse = this.animate.currDate - this.animate.prevDate;
    this.animate.prevDate = this.animate.currDate;

    if ( timelapse > 250 ) return; // exit;

    this.player.update( timelapse );
    this.scene.update( timelapse );

    this.renderer.render( this.stage );

  }

  destroy () {

    this.stage.removeStageReference();

    this.renderer.destroy();
    this.director.destroy();
    this.speaker.destroy();
    this.player.destroy();
    this.mover.destroy();
    this.scene.destroy();
    this.menu.destroy();

    delete this;

  }

}