'use strict';

import _          from 'lodash';
import {Menu}     from 'game/module/Menu';
import {Input}    from 'game/module/Input';
import {Scene}    from 'game/module/Scene';
import {Mover}    from 'game/module/Mover';
import {Script}   from 'game/module/Script';
import {Player}   from 'game/module/Player';
import {Editor}   from 'game/module/Editor';
import {Director} from 'game/module/Director';
import Messenger  from 'event-aggregator';

var Opts;
var configs = {
  sprites: null,
  player: null,
  script: null,
  scene: null,
  menu: null
};

export class Game {

  constructor ( options ) {

    Opts = options;

    this.DOMcontainer = document.createElement('div');
    document.body.appendChild( this.DOMcontainer );
    this.DOMcontainer.id = 'game-container';

    this.viewport = {
      x: 0,
      y: 0,
      width: 480,
      height: 270,
      resolution: 4
    };

    this.messenger = new Messenger.EventAggregator();

    history.replaceState('player', 'player');
    window.addEventListener('popstate', this.onPopState.bind( this ));

    window.onbeforeunload = function() {
      return "Are you sure you want to leave?";
    }

    this.load();

  }

  onPopState ( e ) {

    this.input.mode = e.state;

    if ( this.input.mode != 'player' )
      return; // exit

    this.menu.reset();

  }

  load () {

    var self = this;
    var promises = [];
    var sceneIndex = this.sceneIndex || 0;

    Opts.sceneCfgUrl  = Opts.sceneCfgUrl.replace('${sceneIndex}', sceneIndex );
    Opts.scriptCfgUrl = Opts.scriptCfgUrl.replace('${sceneIndex}', sceneIndex );

    this.assetLoaders = [];

    promises.push( loadAsset('sprites.json', Opts.spritesCfgUrl, configs.sprites ) );
    promises.push( loadAsset('player.json',  Opts.playerCfgUrl, configs.player ) );
    promises.push( loadAsset('script.json',  Opts.scriptCfgUrl, configs.script ) );
    promises.push( loadAsset('scene.json',   Opts.sceneCfgUrl,  configs.scene ) );
    promises.push( loadAsset('menu.json',    Opts.menuCfgUrl,   configs.menu ) );

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
  }

  start () {

    configs.scene.height = this.viewport.height - configs.menu.height;

    this.stage    = new PIXI.Container();
    this.renderer = new PIXI.autoDetectRenderer( this.viewport.width, this.viewport.height, { resolution: this.viewport.resolution });

    this.player   = new Player( this, configs.player );
    this.script   = new Script( this, configs.script );
    this.scene    = new Scene( this, configs.scene );
    this.menu     = new Menu( this, configs.menu );

    this.director = new Director( this );
    this.editor   = new Editor( this );
    this.input    = new Input( this );
    this.mover    = new Mover( this );

    this.mode     = 'player';

    this.scene.addSprite( this.player );

    this.update.prevDate = Date.now();
    requestAnimationFrame( this.update.bind( this ) );
    this.DOMcontainer.appendChild( this.renderer.view );

  }

  update () {

    var timelapse;

    requestAnimationFrame( this.update.bind( this ) );

    this.update.currDate = Date.now();
    timelapse = this.update.currDate - this.update.prevDate;
    this.update.prevDate = this.update.currDate;

    if ( timelapse > 250 ) return; // exit;

    this.director.update( timelapse );
    this.scene.update( timelapse );
    this.menu.update( timelapse );

    this.renderer.render( this.stage );

  }

  destroy () {

    this.stage.removeStageReference();

    this.renderer.destroy();
    this.director.destroy();
    this.player.destroy();
    this.mover.destroy();
    this.scene.destroy();
    this.menu.destroy();

    delete this;

  }

}