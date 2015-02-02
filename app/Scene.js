'use strict';

import _ from 'lodash';
import Entity from 'app/Entity';
import Player from 'app/Player';

class Scene {

  constructor ( viewCFG, sceneCFG, stage, keyInput ) {

    this._stage = stage;
    this._viewport = viewCFG;
    this._keyInput = keyInput;

    this._parallaxLayers = [];

    this._ground = {
      back: new PIXI.DisplayObjectContainer(),
      mid:  new PIXI.DisplayObjectContainer(),
      fore: new PIXI.DisplayObjectContainer(),
    };

    stage.mouseup = this.onMouseUp.bind( this );

    this._ground.back.interactive = true;
    this._ground.back.click = this.onClick;

    this._stage.addChild( this._ground.back );
    this._stage.addChild( this._ground.mid );
    this._stage.addChild( this._ground.fore );

    this._player = this.addPlayer( sceneCFG.player );

    this._backgrounds = [];
    sceneCFG.backgrounds.forEach( function ( cfg ) {
      this.addBackground( cfg );
    }.bind( this ));

    this._entities = [];
    sceneCFG.entities.forEach( function ( cfg ) {
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

  onMouseUp ( interactionData ) {

    var pos = interactionData.getLocalPosition( this._stage );

    pos.x -= Math.round( this._viewport.x );
    pos.y -= Math.round( this._viewport.y );

    this._player.setDestination( pos );

  }

  update ( timelapse ) {

    var p_x = this._player._sprite.position.x;
    var p_d = this._player.dir;

    var v_w = this._viewport.width;
    var v_x = this._viewport.x;

    var delta = 0;

    if ( this._player.state === 'walking' ) {
      // RIGHT
      if ( p_d === 1 ) {
        if ( p_x > Math.abs( v_x ) + v_w - 50 ) {
          this._viewport.x = -1 * ( p_x - ( v_w - 50 ) );
        }
      }
      // LEFT
      else if ( p_d === -1 ) {
        if ( p_x < Math.abs( v_x ) + 50 ) {
          this._viewport.x = 50 - p_x;
        }
      }

      v_x = Math.min( Math.max( ( this._maxWidth - v_w ) * -1, this._viewport.x ), 0 );
    }
    else {

      let delta = v_x + p_x - ( v_w / 2 );

      if ( Math.abs( delta ) < 2 ) {
        v_x = v_x;
      }

      else if ( Math.abs( delta ) > 0 ) {
        let dir = delta / Math.abs( delta );
        v_x -= ( timelapse / 1000 ) * dir * this._player.states['walking'].speed;
      }
    }

    this._viewport.x = Math.min( Math.max( ( this._maxWidth - v_w ) * -1, v_x ), 0 );

    _.each( this._ground, function ( ground ) {
      ground.x = this._viewport.x;
    }.bind( this ));

    this._parallaxLayers.forEach( function (layer ) {
      layer.x = this._viewport.x * layer._parallax;
    }.bind( this ));

    // PLAYER
    this._player.update( timelapse );

  }

}

export default Scene;