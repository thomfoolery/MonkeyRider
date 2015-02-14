export class Background {

  constructor ( cfg, viewConfig ) {

    if ( ! cfg.anchor ) {
      cfg.anchor = {};
      cfg.anchor.x = 0;
      cfg.anchor.y = 1;
    }

    cfg.frameWidth  = cfg.frameWidth  || viewConfig.width;
    cfg.frameHeight = cfg.frameHeight || viewConfig.height;

    if ( ! cfg.position )
      cfg.position = {};

    cfg.position.y = cfg.position.y || viewConfig.height;

    this.configure ( cfg );

  }

  configure ( cfg ) {

    this.imageUrl   = cfg.imageUrl || this.imageUrl || 'bg.' +  Date.now();

    this._texture   = new PIXI.Texture.fromImage( cfg.imageUrl );
    this._sprite    = new PIXI.Sprite( this._texture );

    // sprite axis properties
    ['scale','anchor','position'].forEach( prop => {
      if ( cfg.hasOwnProperty( prop ) ) {
        // axis
        ['x','y'].forEach( axis => {
          if ( cfg[ prop ][ axis ] )
            this._sprite[ prop ][ axis ] = cfg[ prop ][ axis ];
        });
      }
    });

    this.parallax = cfg.parallax || 1;

    if ( cfg.tint )
      this._sprite.tint = parseInt( cfg.tint, 16 );

    this._frame = {
      x: 0,
      y: 0,
      width:  cfg.frameWidth,
      height: cfg.frameHeight
    };

    this._texture.setFrame( this._frame );

  }

  toJSON () {

    var obj = {
      x:          this._sprite.position.x,
      y:          this._sprite.position.y,
      tint:       this._sprite.tint.toString(16).toUpperCase(),
      scale:      this._sprite.scale.x,
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