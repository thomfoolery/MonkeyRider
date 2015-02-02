'use strict';

import Entity from 'app/Entity';

class Scene {

  constructor ( stage ) {

    this._stage = stage;
    this._entities = [];
    this._backgrounds = [];

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

    this._stage.addChild( bg );
    this._backgrounds.push( bg );
    return bg;

  }

  addEntity ( cfg ) {

    var entity = new Entity( cfg, this._stage );

    this._stage.addChild( entity.Sprite );
    this._entities.push( entity );
    return entity;

  }

}

export default Scene;