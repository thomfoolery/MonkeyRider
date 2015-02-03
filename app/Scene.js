'use strict';

import _ from 'lodash';
import Entity from 'app/Entity';

class Scene {

  constructor ( viewCFG, sceneConfig, sceneScript, stage, player, scriptor ) {

    this._viewport = new PIXI.DisplayObjectContainer();
    this._viewport.cfg = viewCFG;

    this._stage    = stage;
    this._scriptor = scriptor;

    this._parallaxLayers = [];

    this._ground = {
      back: new PIXI.DisplayObjectContainer(),
      mid:  new PIXI.DisplayObjectContainer(),
      fore: new PIXI.DisplayObjectContainer(),
    };

    this._ground.fore.addChild( player._sprite );
    this._ground.back.interactive = true;

    this._stage.addChild( this._viewport );
    this._stage.mouseup = this.onMouseUp.bind( this );

    this._viewport.addChild( this._ground.back );
    this._viewport.addChild( this._ground.mid );
    this._viewport.addChild( this._ground.fore );

    this._backgrounds = [];
    sceneConfig.backgrounds.forEach( function ( cfg ) {
      this.addBackground( cfg );
    }.bind( this ));

    this._entities = [];
    sceneConfig.entities.forEach( function ( cfg ) {
      this.addEntity( cfg );
    }.bind( this ));

    this._maxWidth = this._stage.width;

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

    var entity = new Entity( cfg, this._scriptor );

    if ( cfg.sceneGround == 'fore' )
      this._ground.fore.addChild( entity._sprite );
    else
      this._ground.back.addChild( entity._sprite );

    this._entities.push( entity );
    return entity;

  }

  onMouseUp ( interactionData ) {

    var pos = interactionData.getLocalPosition( this._stage );

    pos.x -= Math.round( this._viewport.x );
    pos.y -= Math.round( this._viewport.y );

    this._scriptor._player.setDestination( pos );

  }

  update ( timelapse ) {

    var player = this._scriptor._player;

    var p_x = player._sprite.position.x;
    var p_d = player.dir;

    var v_w = this._viewport.cfg.width;
    var v_x = this._viewport.x;

    var delta = 0;

    if ( player.state != 'walking' ) {

      let delta = v_x + p_x - ( v_w / 2 );

      if ( Math.abs( delta ) < 2 ) {
        v_x = v_x;
      }

      else if ( Math.abs( delta ) > 0 ) {
        let dir = delta / Math.abs( delta );
        v_x -= ( timelapse / 1000 ) * dir * player.states['walking'].speed;
      }
    }
    else {
      // RIGHT
      if ( p_d === 1 ) {
        if ( p_x > Math.abs( v_x ) + v_w - 50 )
          v_x = -1 * ( p_x - ( v_w - 50 ) );
      }
      // LEFT
      else if ( p_d === -1 ) {
        if ( p_x < Math.abs( v_x ) + 50 )
          v_x = 50 - p_x;
      }
    }

    this._viewport.x = Math.min( Math.max( ( this._maxWidth - v_w ) * -1, v_x ), 0 );

    this._parallaxLayers.forEach( function (layer ) {
      layer.x = this._viewport.x * layer._parallax;
    }.bind( this ));

    // PLAYER
    player.update( timelapse );

  }

}

export default Scene;