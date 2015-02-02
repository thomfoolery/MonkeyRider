'use strict';

import Entity from 'app/Entity';
import Player from 'app/Player';

class Scene {

  constructor ( cfg, stage, keyInput ) {

    this._stage = stage;
    this._keyInput = keyInput;

    this._ground = {
      back: new PIXI.DisplayObjectContainer(),
      mid:  new PIXI.DisplayObjectContainer(),
      fore: new PIXI.DisplayObjectContainer()
    };

    this._stage.addChild( this._ground.back );
    this._stage.addChild( this._ground.mid );
    this._stage.addChild( this._ground.fore );

    this._player = this.addPlayer( cfg.player );

    this._backgrounds = [];
    cfg.backgrounds.forEach( function ( cfg ) {
      this.addBackground( cfg );
    }.bind( this ));

    this._entities = [];
    cfg.entities.forEach( function ( cfg ) {
      this.addEntity( cfg );
    }.bind( this ));

  }

  addBackground ( cfg ) {

    var tx = new PIXI.Texture.fromImage( cfg.imageURL );
    var bg = new PIXI.Sprite( tx );

    bg.position.x = cfg.x || 0;
    bg.position.y = cfg.y || 200;

    bg.scale.x = cfg.scale || 1;
    bg.scale.y = cfg.scale || 1;

    bg.anchor.x = 0;
    bg.anchor.y = 1;

    this._ground.back.addChild( bg );
    this._backgrounds.push( bg );
    return bg;

  }

  addEntity ( cfg ) {

    var entity = new Entity( cfg, this._stage );

    if ( cfg.sceneGround == 'fore' )
      this._ground.fore.addChild( entity._sprite );
    else
      this._ground.back.addChild( entity._sprite );

    this._entities.push( entity );
    return entity;

  }

  addPlayer ( cfg, Keyboard ) {

    var player = new Player( cfg, this._stage, this._keyInput );

    this._ground.fore.addChild( player._sprite );
    this._player = player;
    return player;

  }

  update ( timelapse ) {
    this._player.update( timelapse );
  }

}

export default Scene;