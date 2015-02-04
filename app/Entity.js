'use strict';

class Entity {

  constructor( cfg, director, controls ) {

    this.id          = cfg.id     || 'entity' + Date.now();

    this.dir         = cfg.dir    || 1;
    this.scale       = cfg.scale  || 1;
    this.width       = cfg.width  || 0;
    this.height      = cfg.height || 0;

    this.state       = cfg.state  || 'default';
    this.states      = cfg.states || { "default": { start: 0 } };
    this.frameIndex  = this.states[ this.state ].start;
    this.speechColor = cfg.speechColor || 'white';

    this.director    = director;
    this.controls    = controls;

    this._texture = new PIXI.Texture.fromImage( cfg.imageURL );
    this._sprite = new PIXI.Sprite( this._texture );
    this._frame = {
      x: this.frameIndex * this.width,
      y: 0,
      width: this.width,
      height: this.height
    };

    this._sprite.position.x = cfg.x || 0;
    this._sprite.position.y = cfg.y || 0;

    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 1;

    this._sprite.scale.x = this.scale;
    this._sprite.scale.y = this.scale;

    if ( cfg.interactive != false ) {
      this._sprite.interactive =  this._sprite.buttonMode = true;
      this._sprite.mouseover = this.onMouseOver.bind( this );
      this._sprite.mouseout = this.onMouseOut.bind( this );
      this._sprite.click = this.onClick.bind( this );
    }

    if ( cfg.tint )
      this._sprite.tint = parseInt( cfg.tint, 16 );

    this._texture.setFrame( this._frame );

  }

  onMouseOver ( e ) {

    this.controls._state.set('entityID', this.id );
    this.director._state.set('entity', this );

  }

  onMouseOut ( e ) {

    this.controls._state.set('entityID', null );

    if ( ! this.controls._state.get('isActive') )
      this.director._state.set('entity', null );

  }

  onClick ( e ) {

    this.controls._state.set('isActive', true );
    this.controls._state.set('entityID', this.id );

  }

  setState ( state ) {

    this.state      = state;
    this.frameIndex = this.states[ state ].start;
    this._frame.x   = this.frameIndex * this.width;

    this._texture.setFrame( this._frame );

  }

  speak ( speech ) {

    this.speech = speech;

    if ( speech ) {

      let cfg = {
        font: "5px monospace",
        fill: this.speechColor,
        stroke: 'black',
        strokeThickness: 2
      };

      if ( this._textContainer && this._textContainer.parent );
        this._sprite.parent.removeChild( this._textContainer );

      this._textContainer = new PIXI.DisplayObjectContainer();

      let offset = 0;
      speech.forEach( function ( line, index ) {

        var textSprite = new PIXI.Text( line, cfg );

        textSprite.resolution = 3;
        textSprite.anchor.x = 0;
        textSprite.anchor.y = 0;
        textSprite.y = index * 6;

        offset += 6;

        this._textContainer.addChild( textSprite );

      }.bind( this ));

      this._textContainer.position.x = this._sprite.position.x;
      this._textContainer.position.y = this._sprite.position.y - this._sprite.height - offset - 2;

      this._sprite.parent.addChild( this._textContainer );
    }
    else {
      this._sprite.parent.removeChild( this._textContainer );
    }

  }

  update ( timelapse ) {}

}

export default Entity;