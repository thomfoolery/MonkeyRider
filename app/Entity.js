'use strict';

class Entity {

  constructor( cfg, stage ) {

    this.width  = cfg.width  || 0;
    this.height = cfg.height || 0;
    this.scale  = cfg.scale  || 1;

    this.state  = cfg.state  || 'standFacing';
    this.dir    = cfg.dir    || 1;

    this.currFrame = 0;

    this.states = {
      walking: {
        start: 0,
        length: 5,
        isAnimated: true
      },
      standing: {
        start: 6
      },
      standFacing: {
        start: 7
      },
      standBacking: {
        start: 8
      },
      knocking: {
        start: 9
      }
    };

    this.Texture = new PIXI.Texture.fromImage( cfg.imageURL );
    this.Sprite = new PIXI.Sprite( this.Texture );

    this.Sprite.position.x = cfg.x || 0;
    this.Sprite.position.y = cfg.y || 0;

    this.Sprite.anchor.x = 0.5;
    this.Sprite.anchor.y = 1;

    this.Sprite.scale.x = this.scale;
    this.Sprite.scale.y = this.scale;

    this.Texture.setFrame({
      x: 0, y: 0,
      width: this.width,
      height: this.height
    });

    stage.addChild( this.Sprite );

  }

  update () {

    if ( this.states[ this.state ].isAnimated ) {
      this.Sprite.scale.x = this.scale * this.dir;

      if ( this.currFrame < this.states[ this.state ].length )
        this.currFrame++;
      else
        this.currFrame = this.states[ this.state ].start;
    }
    else {
      this.currFrame = this.states[ this.state ].start;
    }

    this.Texture.setFrame({
      x: this.currFrame * this.width,
      y: 0,
      width: this.width,
      height: this.height
    });
  }

}

export default Entity;