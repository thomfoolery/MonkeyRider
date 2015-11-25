'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import Game from 'game/module/Game';
import Sprite from 'game/module/Sprite';
import Background from 'game/module/Background';

export default class Scene {

  constructor ( cfg ) {

    this.view        = new PIXI.Container();
    this.width       = cfg.meta.width;
    this.view.height = this.height = cfg.height;

    this.view.y = (Game.viewport.height - this.height) * -1;

    Game.stage.addChild( this.view );

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
      var sprite = new Sprite( cfg );
      this.addSprite( sprite );
    }.bind( this ));

  }

  addBackground ( cfg ) {

    var bg = new Background( cfg, this );

    this.backgrounds.push( bg );
    this.view.addChild( bg._sprite );

  }

  addSprite ( sprite ) {

    this.layers[ sprite.z || 0 ].addChild( sprite._container );
    this.sprites[ sprite.id ] = sprite;
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

  findSpriteByPoint ( x, y ) {

    var match;
    this.sprites.forEach( function ( sprite ) {
      if ( sprite._sprite.containsPoint( new PIXI.Point( x / Game.viewport.resolution, y / Game.viewport.resolution ) ) )
        match = sprite;
    }, this );
    return match;
  }

  update ( timelapse ) {

    var vW = Game.viewport.width;
    var vX = Game.viewport.x;

    if ( Game.player.position.x > Game.viewport.x + vW/4*3 )
      vX += timelapse / 1000 * (Game.player.speed*2);
    else if ( Game.player.position.x < Game.viewport.x + vW/4 )
      vX -= timelapse / 1000 * (Game.player.speed*2);

    Game.viewport.x = Math.max( Math.min( vX, this.width - vW ), 0 );

    this.backgrounds.forEach( function ( bg ) {
      bg.x = Game.viewport.x * -1;
    }.bind( this ));

    this.layers.forEach( function ( layer ) {
      layer.x = Game.viewport.x * -1;
    }.bind( this ));

    this.sprites.forEach( function ( sprite ) {
      sprite.update( timelapse );
    }.bind( this ));

  }

  save () {

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

     Game.playerdestroy();

     delete this.backgrounds;
     delete this.sprites;
     delete this.layers;

  }

}