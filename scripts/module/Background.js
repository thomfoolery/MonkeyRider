'use strict';

var S; // scene
var G; // game

var PUBLIC_PROPS = {
  "id":       { type: 'text' },
  "tint":     { type: 'text' },
  "parallax": { type: 'number', step: 0.01 },
  "imageUrl": { type: 'text' }
};

export class Background {

  constructor ( cfg, scene, game ) {

    S = scene;
    G = game;

    if ( ! cfg.id )          cfg.id          = 'background.' + Date.now();
    if ( ! cfg.tint )        cfg.tint        = 'FFFFFF';
    if ( ! cfg.imageUrl )    cfg.imageUrl    = '';
    if ( ! cfg.parallax )    cfg.parallax    = 1;

    this.configure ( cfg );

  }

  configure ( cfg ) {

    this._texture = new PIXI.Texture.fromFrame( cfg.imageUrl );
    this._sprite  = new PIXI.Sprite( this._texture );

    this._sprite.anchor.y   = 1;
    this._sprite.position.y = G.viewport.height;

    if ( this._sprite.height < G.viewport.height ) {
      let scale = S.height / this._sprite.height;
      this._sprite.width *= scale;
      this._sprite.height *= scale;
    }

    this.editablePropertyKeys().forEach( prop => {
      if ( cfg.hasOwnProperty( prop ) )
        this[ prop ] = cfg[ prop ];
    });

  }

  get x () { return this._sprite.x; }
  set x ( value ) { this._sprite.x = value * this.parallax * -1; }

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