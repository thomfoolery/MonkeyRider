export class Background {

  constructor ( cfg, viewConfig ) {

    this.imageURL = cfg.imageURL;

    this._texture = new PIXI.Texture.fromImage( cfg.imageURL );
    this._sprite  = new PIXI.Sprite( this._texture );

    this._sprite.position.x = cfg.x || 0;
    this._sprite.position.y = cfg.y || 200;

    this._sprite.scale.x = cfg.scale || 1;
    this._sprite.scale.y = cfg.scale || 1;

    this._sprite.anchor.x = 0;
    this._sprite.anchor.y = 1;

    this.parallax = cfg.parallax || 1;

    if ( cfg.tint )
      this._sprite.tint = parseInt( cfg.tint, 16 );

    this._frame = {
      x: 0,
      y: 0,
      width:  viewConfig.width,
      height: viewConfig.height
    };

    this._texture.setFrame( this._frame );
  }

  toJSON () {

    var obj = {
      x:        this._sprite.position.x,
      y:        this._sprite.position.y,
      tint:     this._sprite.tint.toString(16).toUpperCase(),
      scale:    this._sprite.scale.x,
      imageURL: this.imageURL,
      parallax: this.parallax
    };

    return obj;

  }

  toString() {

    return JSON.stringify( this.toString() );

  }

}