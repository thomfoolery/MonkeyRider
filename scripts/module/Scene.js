'use strict';

import _            from 'lodash';
import Backbone     from 'backbone';
import {Sprite}     from 'game/module/Sprite';
import {Background} from 'game/module/Background';

var G;

export class Scene {

  constructor ( game, cfg ) {

    G = game;

    this.view        = new PIXI.Container();
    this.width       = cfg.meta.width;
    this.view.height = this.height = cfg.height;

    this.view.y = (G.viewport.height - this.height) * -1;

    G.stage.addChild( this.view );

    this.backgrounds = [];
    cfg.gameObjects.backgrounds.forEach( function ( cfg ) {
      this.addBackground( cfg );
    }.bind( this ));

    this.layers = [];
    this.layers.push( new PIXI.Container() ); // background
    this.layers.push( new PIXI.Container() ); // foreground

    this.view.addChild( this.layers[0] );
    this.view.addChild( this.layers[1] );

    this.sprites     = [];
    this.actionables = [];
    cfg.gameObjects.sprites.forEach( function ( cfg ) {
      var sprite = new Sprite( cfg, G );
      this.addSprite( sprite );
    }.bind( this ));

  }

  addBackground ( cfg ) {

    var bg = new Background( cfg, this, G );

    this.backgrounds.push( bg );
    this.view.addChild( bg._sprite );

  }

  addSprite ( sprite ) {

    this.layers[ sprite.z || 0 ].addChild( sprite._sprite );
    this.sprites.push( sprite );

    if ( sprite.actionable )
      this.actionables.push( sprite );

    return sprite;

  }

  removeSprite( sprite ) {

    if ( sprite.actionable )
      this.actionables.splice( this.actionables.indexOf( sprite ), 1 );

    this.sprites.splice( this.sprites.indexOf( sprite ), 1 );
  }

  update ( timelapse ) {

    var vW = G.viewport.width;
    var vX = G.viewport.x;

    if ( G.player.position.x > G.viewport.x + vW/4*3 )
      vX += timelapse / 1000 * (G.player.speed*2);
    else if ( G.player.position.x < G.viewport.x + vW/4 )
      vX -= timelapse / 1000 * (G.player.speed*2);

    G.viewport.x = Math.max( Math.min( vX, this.width - vW ), 0 );

    this.backgrounds.forEach( function ( bg ) {
      bg.x = G.viewport.x * -1;
    }.bind( this ));

    this.layers.forEach( function ( layer ) {
      layer.x = G.viewport.x * -1;
    }.bind( this ));

    this.sprites.forEach( function ( sprite ) {
      sprite.update( timelapse );
    }.bind( this ));

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

  }

}