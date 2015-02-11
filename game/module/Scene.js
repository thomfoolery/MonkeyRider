'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import {Entity} from 'game/module/Entity';
import {Background} from 'game/module/Background';

export class Scene {

  constructor ( game ) {

    this.game      = game;
    this._maxWidth = this.game.sceneConfig.meta.width;

    var player    = this.game.player ? this.game.player._sprite : null
    this.items    = new Backbone.Collection( this.game.sceneConfig.gameObjects.items );
    this.viewport = { x: 0 };

    this.backgrounds = [];
    this.game.sceneConfig.gameObjects.backgrounds.forEach( function ( cfg ) {
      this.addBackground( cfg );
    }.bind( this ));

    this.layers = [];
    this.layers.push( new PIXI.DisplayObjectContainer() ); // background
    this.layers.push( new PIXI.DisplayObjectContainer() ); // foreground

    this.game.stage.addChild( this.layers[0] );
    this.game.stage.addChild( this.layers[1] );

    this.entities = [];
    this.game.sceneConfig.gameObjects.entities.forEach( function ( cfg ) {
      this.addEntity( cfg );
    }.bind( this ));

    this.layers[0].addChild( player );

    this.mousePosition = {};
    this.game.stage.mousemove = this.onMouseMove.bind( this );
    this.game.stage.mouseup = this.onMouseUp.bind( this );

  }

  addBackground ( cfg ) {

    var bg = new Background( cfg, this.game.viewConfig );

    this.backgrounds.push( bg );
    this.game.stage.addChild( bg._sprite );

  }

  addEntity ( cfg ) {

    var entity = new Entity( cfg, this.game );
    this.layers[ cfg.z || 0 ].addChild( entity._sprite );
    this.entities.push( entity );

    return entity;

  }

  onMouseUp ( interactionData ) {

    var position = interactionData.getLocalPosition( this.game.stage );
    position.x -= Math.round( this.viewport.x );

    this.game.messenger.publish('scene/mouseup', position );

  }

  onMouseMove ( interactionData ) {

    var position = interactionData.getLocalPosition( this.game.stage );
    this.mousePosition.x = Math.round( position.x );

  }

  update ( timelapse ) {

    var vW = this.game.viewConfig.width;
    var vX = this.viewport.x;

    let dir = 0;
    if ( this.mousePosition.x > vW - vW / 8 ) dir = -1;
    else if ( this.mousePosition.x < vW / 8 ) dir = 1;
    vX += ( timelapse / 1000 ) * dir * 150;

    this.viewport.x = Math.min( Math.max( ( this._maxWidth - vW ) * -1, vX ), 0 );

    this.backgrounds.forEach( function ( bg ) {
      bg._frame.x = this.viewport.x * bg.parallax;
      bg._texture.setFrame( bg._frame );
    }.bind( this ));

    this.layers.forEach( function ( layer ) {
      layer.x = this.viewport.x;
    }.bind( this ));

  }

  getItem ( itemID ) {

    return this.items.findWhere({ id: itemID });

  }

  toJSON () {

    var obj = {
      meta: this.game.sceneConfig.meta,
      gameObjects: {
        backgrounds: [],
        entities: [],
        items: this.items.toArray()
      }
    };

    this.backgrounds.forEach( bg => {
      obj.gameObjects.backgrounds.push( bg.toJSON() );
    });

    this.entities.forEach( entities => {
      obj.gameObjects.entities.push( entities.toJSON() );
    });

    return obj;

  }

  toString () {

    return JSON.stringify( this.toJSON() );

  }

}