'use strict';

import Backbone from 'backbone';

var AnimationModel = Backbone.Model.extend({
  defaults: {
    state: 'default'
  }
});

class Entity {

  constructor( cfg, game ) {

    this.game        = game;

    this.id          = cfg.id     || 'entity' + Date.now();
    this.scale       = cfg.scale  || 1;
    this.width       = cfg.width  || 0;
    this.height      = cfg.height || 0;
    this.speechColor = cfg.speechColor || 'white';
    this.states      = cfg.states || { "default": { start: 0 } };

    this.destination = {
      x: null,
      y: null
    };

    this._anim       = new AnimationModel({
      state: 'default',
      dir:   cfg.dir || 1
    });

    this._frameIndex = this.states[ this._anim.get('state') ].start;
    this._anim.on('change:state', this.onAnimationStateChange, this );

    this._texture = new PIXI.Texture.fromImage( cfg.imageURL );
    this._sprite = new PIXI.Sprite( this._texture );
    this._frame = {
      x: this._frameIndex * this.width,
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

    if ( this.game.controls._state.get('isActive') ) return;
    this.game.controls._state.set('entityID', this.id );
    this.game.director._state.set('entity', this );

    // console.log('mouse over');

  }

  onMouseOut ( e ) {

    if ( this.game.controls._state.get('isActive') ) return;
    this.game.controls._state.set('entityID', null );
    this.game.director._state.set('entity', null );

    // console.log('mouse out');

  }

  onClick ( e ) {

    if ( this.game.director._state.get('act') ) return;

    this.game.controls._state.set('isActive', true );
    this.game.controls._state.set('entityID', this.id );
    this.game.director._state.set('entity', this );

    // console.log('mouse click');

  }

  onAnimationStateChange ( model ) {

    var state = this._anim.get('state');

    this._frameIndex = this.states[ state ].start;
    this._frame.x   = this._frameIndex * this.width;
    this._texture.setFrame( this._frame );
  }

  set ( prop, value ) {

    if ( this._anim.attributes.hasOwnProperty( prop ) )
      this._anim.set( prop, value );

    else
      if ( this.hasOwnProperty( prop )
        && typeof value === typeof this[ prop ] )
      this[ prop ] = value;

  }

  speak ( speech ) {

    if ( this.speech = speech ) {

      let offset = 0;
      let cfg = {
        font: "5px monospace",
        fill: this.speechColor,
        stroke: 'black',
        strokeThickness: 2
      };

      if ( this._textContainer && this._textContainer.parent );
        this._sprite.parent.removeChild( this._textContainer );

      this._textContainer = new PIXI.DisplayObjectContainer();

      this.speech.forEach( function ( line, index ) {

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

  moveTo ( destination ) {

    if ( ( isNaN( destination.x ) && destination.x != null )
      || ( isNaN( destination.y ) && destination.y != null ) ) return;

    var dir = ( this._sprite.position.x > destination.x ) ? -1 : 1 ;

    this._anim.set('dir', dir );
    this._sprite.scale.x = this.scale * dir;

    this.destination = destination;

  }

  update ( timelapse ) {

    if ( this.destination.x ) {

      let distance;

      if ( this._anim.get('state') != 'walking' ) {
        this._frameIndex = this.states['walking'].start;
        this._anim.set('state','walking');
        this.phase = 0;
      }

      this.phase += timelapse;

      if ( this.phase > this.states['walking'].phaseLength ) {
        this._frameIndex++;
        this.phase = 0;
      }

      if ( this._frameIndex > this.states['walking'].frameCount ) {
        this._frameIndex = this.states['walking'].start;
      }

      distance = this._anim.get('dir') * ( timelapse / 1000 ) * this.states[ this._anim.get('state') ].speed;
      this._sprite.position.x += distance;

      // destination reached
      if ( Math.abs( this._sprite.position.x - this.destination.x ) <= distance
        || ( this._anim.get('dir') == 1 && this._sprite.position.x > this.destination.x )
        || ( this._anim.get('dir') == -1 && this._sprite.position.x < this.destination.x ) ) {

        this._sprite.position.x = this.destination.x;
        this._anim.set( this._anim.defaults );
        this.destination.x = null;
        this.phase = 0;

        this._frameIndex = this.states[ this._anim.get('state') ].start;
        this.game.director.startActing();

      }

      this._frame.x = this._frameIndex * this.width;
      this._texture.setFrame( this._frame );

    }

  }

}

export default Entity;