'use strict';

class Entity {

  constructor( cfg, stage ) {

    this.width  = cfg.width  || 0;
    this.height = cfg.height || 0;
    this.scale  = cfg.scale  || 1;

    this._texture = new PIXI.Texture.fromImage( cfg.imageURL );
    this._sprite = new PIXI.Sprite( this._texture );

    this._sprite.position.x = cfg.x || 0;
    this._sprite.position.y = cfg.y || 0;

    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 1;

    this._sprite.scale.x = this.scale;
    this._sprite.scale.y = this.scale;

    if ( cfg.interactive != false ) {
      this._sprite.interactive = true;
      this._sprite.buttonMode  = true;
    }

    if ( cfg.tint )
      this._sprite.tint = parseInt( cfg.tint, 16 );

    this._texture.setFrame({
      x: 0, y: 0,
      width: this.width,
      height: this.height
    });

  }

  update ( timelapse ) {}

}

export default Entity;