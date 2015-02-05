'use strict';

import _ from 'lodash';
import Entity from 'app/Entity';
import Backbone from 'backbone';

class Scene {

  constructor ( game ) {

    this.game = game;

    this.items     = new Backbone.Collection( this.game.sceneConfig.items );
    this._viewport = new PIXI.DisplayObjectContainer();

    this._parallaxLayers = [];

    this._ground = {
      back: new PIXI.DisplayObjectContainer(),
      mid:  new PIXI.DisplayObjectContainer(),
      fore: new PIXI.DisplayObjectContainer(),
    };

    this._ground.fore.addChild( this.game.player._sprite );
    this._ground.back.interactive = true;

    this.game.stage.addChild( this._viewport );
    this.game.stage.mouseup = this.onMouseUp.bind( this );

    this._viewport.addChild( this._ground.back );
    this._viewport.addChild( this._ground.mid );
    this._viewport.addChild( this._ground.fore );

    this._backgrounds = [];
    this.game.sceneConfig.backgrounds.forEach( function ( cfg ) {
      this.addBackground( cfg );
    }.bind( this ));

    this._entities = [];
    this.game.sceneConfig.entities.forEach( function ( cfg ) {
      this.addEntity( cfg );
    }.bind( this ));

    this._maxWidth = this.game.stage.width;

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

    if ( cfg.tint )
      bg.tint = parseInt( cfg.tint, 16 );

    if ( cfg.parallax ) {
      bg._parallax = cfg.parallax;
      this._parallaxLayers.push( bg );
    }

    this._ground.back.addChild( bg );
    this._backgrounds.push( bg );
    return bg;

  }

  addEntity ( cfg ) {

    var entity = new Entity( cfg, this.game );

    if ( cfg.sceneGround == 'fore' )
      this._ground.fore.addChild( entity._sprite );
    else
      this._ground.back.addChild( entity._sprite );

    this._entities.push( entity );
    return entity;

  }

  onMouseUp ( interactionData ) {

    if ( this.game.controls._state.get('isActive') ) return;

    var pos = interactionData.getLocalPosition( this.game.stage );

    pos.x -= Math.round( this._viewport.x );
    pos.y -= Math.round( this._viewport.y );

    this.game.player.moveTo( pos );

  }

  update ( timelapse ) {

    if ( ! this.game.player ) return;

    var p_x = this.game.player._sprite.position.x;
    var p_d = this.game.player.dir;

    var v_w = this.game.viewConfig.width;
    var v_x = this._viewport.x;

    var delta = v_x + p_x - ( v_w / 2 );

    if ( Math.abs( delta ) < 2 ) {
      v_x = v_x;
    }

    else if ( Math.abs( delta ) > 0 ) {
      let dir = delta / Math.abs( delta );
      v_x -= ( timelapse / 1000 ) * dir * this.game.player.states['walking'].speed;
    }

    this._viewport.x = Math.min( Math.max( ( this._maxWidth - v_w ) * -1, v_x ), 0 );

    this._parallaxLayers.forEach( function (layer ) {
      layer.x = this._viewport.x * layer._parallax;
    }.bind( this ));

  }

  getItem ( itemID ) {

    return this.items.findWhere({ id: itemID });

  }

}

export default Scene;