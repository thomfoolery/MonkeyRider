'use strict';

var PUBLIC_PROPS = {
  "id":       { type: 'text' },
  "tint":     { type: 'text' },
  "parallax": { type: 'number', step: 0.01 },
  "imageUrl": { type: 'text' }
};

export class Background {

  constructor ( cfg, game ) {

    this.game = game;

    if ( ! cfg.id )          cfg.id          = 'background.' + Date.now();
    if ( ! cfg.tint )        cfg.tint        = 'FFFFFF';
    if ( ! cfg.imageUrl )    cfg.imageUrl    = '';
    if ( ! cfg.parallax )    cfg.parallax    = 1;
    if ( ! cfg.frameWidth )  cfg.frameWidth  = this.game.viewport.width;
    if ( ! cfg.frameHeight ) cfg.frameHeight = this.game.viewport.height;

    this.configure ( cfg );

  }

  configure ( cfg ) {

    if ( ! this._texture || cfg.imageUrl != this._texture.baseTexture.imageUrl ) {
      this._texture = new PIXI.Texture.fromImage( cfg.imageUrl );
      this._sprite  = new PIXI.Sprite( this._texture );
    }

    this._frame = {
      x: 0,
      y: 0,
      width:  cfg.frameWidth  || this._sprite.width,
      height: cfg.frameHeight || this._sprite.height
    };

    this._texture.setFrame( this._frame );

    this.editablePropertyKeys().forEach( prop => {
      if ( cfg.hasOwnProperty( prop ) )
        this[ prop ] = cfg[ prop ];
    });

  }

  get x () { return this._frame.x; }
  set x ( value ) { this._frame.x = value * this.parallax; this._texture.setFrame( this._frame ); }

  get tint () { return this._sprite.tint.toString(16).toUpperCase(); }
  set tint ( value ) { this._sprite.tint = parseInt( value, 16 ); }

  get visible () { return this._sprite.visible; }
  set visible ( value ) { this._sprite.visible = !! value }

  get imageUrl () { return this._texture.baseTexture.imageUrl; }
  set imageUrl ( value ) { this._texture = new PIXI.Texture.fromImage( value ); }

  editablePropertyKeys () {

    return Object.keys( PUBLIC_PROPS );

  }

  editablePropertyConfig ( key ) {

    return PUBLIC_PROPS[ key ];

  }

  toJSON () {

    var obj = {
      x:          this.x,
      y:          this.y,
      tint:       this.tint,
      scale:      this.scaleX,
      imageUrl:   this.imageUrl,
      parallax:   this.parallax
    };

    return obj;

  }

  toString() {

    return JSON.stringify( this.toString() );

  }

  destroy () {

     this._sprite.removeStageReference();

  }

}