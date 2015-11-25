'use strict';

import _ from 'lodash';
import Menu from 'game/module/Menu';
import Input from 'game/module/Input';
import Scene from 'game/module/Scene';
import Script from 'game/module/Script';
import Player from 'game/module/Player';
import Director from 'game/module/Director';
import Messenger from 'event-aggregator';

import playerConfig from 'game/config/player.json!';

const RESOLUTION = {
  width: 420, // pixels
  height: 210 // pixels
};

var configs = {
  sprites: null,
  player: null,
  script: null,
  scene: null,
};

var Game = {

  init ( options ) {

    this.opts = options;

    this.messenger = new Messenger.EventAggregator();

    this.gameContainer = document.createElement('div');
    document.body.appendChild( this.gameContainer );
    this.gameContainer.id = 'game-container';

    this.viewport = Object.assign(
      RESOLUTION,
      { x: 0, y: 0 },
      { resolution: Math.floor( screen.width / RESOLUTION.width ) }
    );

    this.viewport.height += Menu.height;

    history.replaceState('play', 'play');
    window.addEventListener('popstate', this.onPopState.bind( this ));

    this.load();

  },

  onPopState ( e ) {

    Input.mode = e.state;

    if ( Input.mode != 'play' ) {
      return; // exit
    }

    Menu.reset();

  },

  load () {

    var self = this;
    var promises = [];
    var sceneIndex = this.sceneIndex || 0;

    this.opts.sceneCfgUrl  = this.opts.sceneCfgUrl.replace('${sceneIndex}', sceneIndex );
    this.opts.scriptCfgUrl = this.opts.scriptCfgUrl.replace('${sceneIndex}', sceneIndex );

    this.assetLoaders = [];

    promises.push( loadAsset('sprites.json', this.opts.spritesCfgUrl, configs.sprites ) );
    promises.push( loadAsset('script.json',  this.opts.scriptCfgUrl,  configs.script ) );
    promises.push( loadAsset('scene.json',   this.opts.sceneCfgUrl,   configs.scene ) );

    Promise
      .all( promises )
      .then( this.start.bind( this ) )
    ;

    function loadAsset( id, url, store ) {
      return new Promise( function ( resolve, reject ) {
        var loader = new PIXI.loaders.Loader();
        loader.add( id, url );
        loader.on('complete', ( loader, resource ) => {
          configs[ id.split('.').shift() ] = resource[ id ].data;
          resolve();
        })
        loader.load();
      });
    }
  },

  start () {

    configs.scene.height = this.viewport.height - Menu.height;

    this.mode     = 'play';
    this.stage    = new PIXI.Container();
    this.renderer = new PIXI.autoDetectRenderer( this.viewport.width, this.viewport.height, { resolution: this.viewport.resolution });

    this.scene    = new Scene( configs.scene );
    this.player   = new Player( playerConfig );
    this.script   = new Script( configs.script );

    this.scene.addSprite( this.player );

    Menu.init();

    this.update.prevDate = Date.now();
    requestAnimationFrame( this.update.bind( this ) );
    this.gameContainer.appendChild( this.renderer.view );

  },

  update () {

    var timelapse;

    requestAnimationFrame( this.update.bind( this ) );

    this.update.currDate = Date.now();
    timelapse = this.update.currDate - this.update.prevDate;
    this.update.prevDate = this.update.currDate;

    if ( timelapse > 250 ) return; // exit;

    Menu.update( timelapse );
    Director.update( timelapse );
    this.scene.update( timelapse );
    this.renderer.render( this.stage );

  },

  destroy () {

    this.stage.removeStageReference();

    this.renderer.destroy();
    this.scene.destroy();

    delete this;

  }

}

export default Game;