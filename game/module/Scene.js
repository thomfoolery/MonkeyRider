'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import {Sprite} from 'game/module/Sprite';
import {Background} from 'game/module/Background';

export class Scene {

  constructor ( game ) {

    this.game       = game;
    this.items      = new Backbone.Collection( this.game.sceneConfig.gameObjects.items );
    this.width      = this.game.sceneConfig.meta.width;

    this.backgrounds = [];
    this.game.sceneConfig.gameObjects.backgrounds.forEach( function ( cfg ) {
      this.addBackground( cfg );
    }.bind( this ));

    this.layers = [];
    this.layers.push( new PIXI.DisplayObjectContainer() ); // background
    this.layers.push( new PIXI.DisplayObjectContainer() ); // foreground

    this.game.stage.addChild( this.layers[0] );
    this.game.stage.addChild( this.layers[1] );

    this.sprites = [];
    this.game.sceneConfig.gameObjects.sprites.forEach( function ( cfg ) {
      this.addSprite( cfg );
    }.bind( this ));

    if ( this.game.player )
      this.layers[ 0 ].addChild( this.game.player._sprite );

    this.mousePosition = {};
    this.game.stage.mousemove = this.onMouseMove.bind( this );
    this.game.stage.mouseout  = this.onMouseOut.bind( this );
    this.game.stage.mouseup   = this.onMouseUp.bind( this );

  }

  addBackground ( cfg ) {

    var bg = new Background( cfg, this.game );

    this.backgrounds.push( bg );
    this.game.stage.addChild( bg._sprite );

  }

  addSprite ( cfg ) {

    var sprite = new Sprite( cfg, this.game );
    this.layers[ cfg.z || 0 ].addChild( sprite._sprite );
    this.sprites.push( sprite );

    return sprite;

  }

  onMouseUp ( interactionData ) {

    var position = interactionData.getLocalPosition( this.game.stage );
    position.x += Math.round( this.game.viewport.x );

    this.game.messenger.publish('scene/mouseup', position );

  }

  onMouseMove ( interactionData ) {

    var position = interactionData.getLocalPosition( this.game.stage );
    this.mousePosition.x = Math.round( position.x );

  }


  onMouseOut ( interactionData ) {

    this.mousePosition.x = this.game.viewport.width / 2;

  }

  update ( timelapse ) {

    var vW = this.game.viewport.width;
    var vX = this.game.viewport.x;

    let dir = 0;
    if ( this.mousePosition.x > vW - vW / 8 ) dir = 1;
    else if ( this.mousePosition.x < vW / 8 ) dir = -1;
    vX += ( timelapse / 1000 ) * dir * 150;

    this.game.viewport.x = Math.max( Math.min( vX, this.width - vW ), 0 );

    this.backgrounds.forEach( function ( bg ) {
      bg.x = this.game.viewport.x * -1;
    }.bind( this ));

    this.layers.forEach( function ( layer ) {
      layer.x = this.game.viewport.x * -1;
    }.bind( this ));

    this.sprites.forEach( function ( sprite ) {
      sprite.update( timelapse );
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
        sprites: [],
        items: this.items.toArray()
      }
    };

    this.backgrounds.forEach( bg => {
      obj.gameObjects.backgrounds.push( bg.toJSON() );
    });

    this.sprites.forEach( sprites => {
      obj.gameObjects.sprites.push( sprites.toJSON() );
    });

    return obj;

  }

  toString () {

    return JSON.stringify( this.toJSON() );

  }

  destroy () {


     this.backgrounds.forEach( function ( background ) {
       background.destroy();
     }.bind( this ));

     this.sprites.forEach( function ( sprite ) {
       sprite.destroy();
     }.bind( this ));

     this.layers.forEach( function ( layer ) {
       layer.removeStageReference();
     }.bind( this ));

     delete this.backgrounds;
     delete this.sprites;
     delete this.layers;
     delete this.items;

  }

}