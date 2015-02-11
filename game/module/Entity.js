'use strict';

import Backbone from 'backbone';

var AnimationModel = Backbone.Model.extend({
  defaults: {
    state: 'default'
  }
});

export class Entity {

  constructor( cfg, game ) {

    this.game        = game;

    this.id          = cfg.id || 'entity' + Date.now();
    this.dir         = cfg.dir || 1;
    this.scale       = cfg.scale  || 1;
    this.imageURL    = cfg.imageURL || '';
    this.speechColor = cfg.speechColor || 'white';

    this.destination = {
      x: null,
      y: null
    };

    this._texture = new PIXI.Texture.fromImage( this.imageURL );
    this._sprite  = new PIXI.Sprite( this._texture );

    this._sprite.position.x = cfg.x || 0;
    this._sprite.position.y = cfg.y || 0;

    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 1;

    this._sprite.scale.x = this.scale * this.dir;
    this._sprite.scale.y = this.scale;

    if ( cfg.states ) {

      this.states = cfg.states;
      this._anim = new AnimationModel({
        dir:   this.dir,
        state: 'default'
      });

      this.width  = cfg.width  || 0,
      this.height = cfg.height || 0

      this._frameIndex = this.states[ this._anim.get('state') ].start;
      this._anim.on('change:state', this.onAnimationStateChange, this );

      this._frame = {
        x: this._frameIndex * this.width,
        y: 0,
        width:  this.width,
        height: this.height
      };

      this._texture.setFrame( this._frame );
    }

    if ( cfg.interactive != false ) {
      this._sprite.interactive =  this._sprite.buttonMode = true;
      this._sprite.mouseover = this.onMouseOver.bind( this );
      this._sprite.mouseout = this.onMouseOut.bind( this );
      this._sprite.click = this.onClick.bind( this );
    }

    if ( cfg.tint )
      this._sprite.tint = parseInt( cfg.tint, 16 );
  }

  onMouseOver ( e ) {

    this.game.messenger.publish('entity/mouseover', this );

  }

  onMouseOut ( e ) {

    this.game.messenger.publish('entity/mouseout', this );

  }

  onClick ( e ) {

    this.game.messenger.publish('entity/click', this );

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

    this.game.speaker.speak( this, speech );

  }

  moveTo ( destination ) {

    this.game.mover.moveTo ( this, destination );

  }

  update ( timelapse ) {

    this.game.mover.update ( this, timelapse );

  }

  toJSON () {

    var obj = {
      id:          this.id,
      dir:         this._anim.get('dir'),
      scale:       this.scale,
      imageURL:    this.imageURL,
      speechColor: this.speechColor,

      x:           this._sprite.x,
      y:           this._sprite.y,
      tint:        this._sprite.tint.toString(16).toUpperCase(),
      interactive: this._sprite.interactive
    };

    if ( this.states ) {
      obj.width  = this._frame.width;
      obj.height = this._frame.height;
      obj.states = this.states;
    }

    return obj;

  }

  toString () {

    return JSON.stringify( this.toJSON );

  }

}