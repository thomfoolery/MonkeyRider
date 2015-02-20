'use strict';

import Backbone from 'backbone';

var PUBLIC_PROPS = {
  "id":          { type: 'text' },
  "x":           { type: 'number', step: 10 },
  "y":           { type: 'number', step: 10 },
  "z":           { type: 'number' },
  "dir":         { type: 'number' },
  "tint":        { type: 'number' },
  "speed":       { type: 'number' },
  "scaleX":      { type: 'number' },
  "scaleY":      { type: 'number' },
  "anchorX":     { type: 'number' },
  "anchorY":     { type: 'number' },
  "interactive": { type: 'boolean' },
  "speechColor": { type: 'text' }
};

export class Sprite {

  constructor( cfg, game ) {

    this.game        = game;
    this.scale       = new PIXI.Point( 1,    1 );
    this.anchor      = new PIXI.Point( 0.5,  1 );
    this.position    = new PIXI.Point( 0,    0 );
    this.destination = new PIXI.Point( null, null );

    if ( ! cfg.id )          cfg.id          = 'sprite.' + Date.now();

    if ( ! cfg.z )           cfg.z           = 0;
    if ( ! cfg.tint )        cfg.tint        = 'FFFFFF';
    if ( ! cfg.speechColor ) cfg.speechColor = 'FFFFFF';

    if ( ! cfg.anchorX ) cfg.anchorX = 0.5;
    if ( ! cfg.anchorY ) cfg.anchorY = 1;

    this.configure( cfg );

  }

  configure ( cfg ) {

    this._animStates = cfg.states;

    this._sprite          = new PIXI.Sprite();

    this._sprite.position = this.position;
    this._sprite.anchor   = this.anchor;
    this._sprite.scale    = this.scale;

    Object.keys( this._animStates ).forEach( state => {
      var frames = this._animStates[ state ].frames;
      Object.keys( frames ).forEach( index => {
        frames[ index ] = new PIXI.Texture.fromFrame( frames[ index ] );
      });
    });

    this.state      = 'default';
    this.animIndex  = 0;
    this._animPhase = 0;

    if ( this.game.editMode || cfg.interactive != false ) {

      this._sprite.interactive = this._sprite.buttonMode = true;
      delete cfg.interactive;

      this._sprite.mouseover = this.onMouseOver.bind( this );
      this._sprite.mouseout  = this.onMouseOut.bind( this );
      this._sprite.click     = this.onClick.bind( this );
    }

    this.editablePropertyKeys().forEach( prop => {
      if ( cfg.hasOwnProperty( prop ) )
        this[ prop ] = cfg[ prop ];
    });

  }

  get x () { return this.position.x; }
  set x ( value ) { this.position.x = value; }

  get y () { return this.position.y; }
  set y ( value ) { this.position.y = value; }

  get dir () { return this.scaleX / Math.abs( this.scaleX ); }
  set dir ( value ) { this.scale.x = Math.abs( this.scale.x ) * (value < 0 ? -1 : 1); }

  get tint () { return this._sprite.tint; }
  set tint ( value ) { this._sprite.tint = parseInt( value, 16 ); }

  get width () { return this._sprite.width; }
  set width ( value ) { console.error('You can not set Sprite dimensions manually.'); }

  get height () { return this._sprite.height; }
  set height ( value ) { console.error('You can not set Sprite dimensions manually.'); }

  get scaleX () { return this.scale.x; }
  set scaleX ( value ) { this.scale.x = value; }

  get scaleY () { return this.scale.y; }
  set scaleY ( value ) { this.scale.y = value; }

  get anchorX () { return this.anchor.x; }
  set anchorX ( value ) { this.anchor.x = value; }

  get anchorY () { return this.anchor.y; }
  set anchorY ( value ) { this.anchor.y = value; }

  get visible () { return this._sprite.visible; }
  set visible ( value ) { this._sprite.visible = !! value }

  get state () { return this._state; }
  set state ( state ) { this._state = state; this.animIndex = 0; this._animPhase = 0; this.isAnimating = ( this._animStates[ state ].frames.length > 1 ) ? true : false ; }

  get animPhase () { return this._animPhase; }
  set animPhase ( phase ) {
    if ( ! this.isAnimating ) return;
    this._animPhase = phase;
    if ( this._animPhase > this._animStates[ this._state ].speed * 1000 ) {
      this._animPhase = 0;
      this.animIndex++;
    }
  }

  get animIndex () { return this._animIndex; }
  set animIndex ( value ) {
    if ( value > this._animStates[ this._state ].frames.length -1 )
      this._animIndex = 0;
    else
      this._animIndex = value;
    this._sprite.setTexture( this._animStates[ this._state ].frames[ this._animIndex ] );
  }

  get interactive () { this._animStates[ this._state ].interactive; }
  set interactive ( value ) { this._sprite.interactive = !! value }

  onMouseOver ( e ) {

    this.game.messenger.publish('sprite/mouseover', this );

  }

  onMouseOut ( e ) {

    this.game.messenger.publish('sprite/mouseout', this );

  }

  onClick ( e ) {

    this.game.messenger.publish('sprite/click', this );

  }

  set ( prop, value ) {

    if ( typeof value === typeof this[ prop ] )
      this[ prop ] = value;
    else
      console.error( this.id + '\'s property ' + prop + ': value types do not match.');

  }

  speak ( speech ) {

    this.game.speaker.speak( this, speech );

  }

  moveTo ( destination ) {

    this.game.mover.moveTo ( this, destination );

  }

  update ( timelapse ) {

    var dir = this.dir;

    this.animPhase += timelapse;

    if ( ! this.game.editMode )
      this.game.mover.update ( this, timelapse );

    if ( ! this.visible ) {
      if ( this.x + ( this.width * this.anchorX ) * this.scaleX > this.game.viewport.x
        && this.x - ( this.width * this.anchorX ) * this.scaleX < this.game.viewport.x + this.game.viewport.width ) {
          this.visible = true;
      }
    }
    else {
      if ( this.x + ( this.width * this.anchorX ) * this.scaleX < this.game.viewport.x
        || this.x - ( this.width * this.anchorX ) * this.scaleX > this.game.viewport.x + this.game.viewport.width ) {
          this.visible = false;
      }
    }

  }

  editablePropertyKeys () {

    return Object.keys( PUBLIC_PROPS );

  }

  editablePropertyConfig ( key ) {

    return PUBLIC_PROPS[ key ];

  }

  toJSON () {

    var obj = {};

    this.editablePropertyKeys().forEach( prop => {
      obj[ prop ] = this[ prop ];
    });

    return obj;

  }

  toString () {

    return JSON.stringify( this.toJSON() );

  }

  destroy () {

     this._sprite.removeStageReference();

  }

}