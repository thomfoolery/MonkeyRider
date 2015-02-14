'use strict';

import Backbone from 'backbone';

var PUBLIC_PROPS = [
  'id',
  'dir',
  'imageUrl',
  'speechColor',
  'x',
  'y',
  'tint',
  'width',
  'height',
  'scaleX',
  'scaleY',
  'anchorX',
  'anchorY',
  'interactive'
];

var AnimationModel = Backbone.Model.extend({
  defaults: {
    state: 'default'
  }
});

export class Entity {

  constructor( cfg, game ) {

    this.game = game;

    if ( ! cfg.id )          cfg.id          = 'entity' + Date.now();
    if ( ! cfg.tint )        cfg.tint        = 'FFFFFF';
    if ( ! cfg.imageUrl )    cfg.imageUrl    = '';
    if ( ! cfg.speechColor ) cfg.speechColor = 'white';

    if ( ! cfg.anchorX ) cfg.anchorX = 0.5;
    if ( ! cfg.anchorY ) cfg.anchorY = 1;

    this.destination = {
      x: null,
      y: null
    };

    this.configure( cfg );

  }

  configure ( cfg ) {

    if ( ! this._texture || cfg.imageUrl != this._texture.baseTexture.imageUrl ) {
      this._texture = new PIXI.Texture.fromImage( cfg.imageUrl );
      this._sprite  = new PIXI.Sprite( this._texture );
    }

    this._frame = {
      x: 0,
      y: 0,
      width:  cfg.width  || this._sprite.width,
      height: cfg.height || this._sprite.height
    };

    if ( cfg.states ) {

      this.states = cfg.states;
      this._anim = new AnimationModel({
        state: 'default'
      });

      this._frameIndex = this.states[ this._anim.get('state') ].start;
      this._anim.on('change:state', this.onAnimationStateChange, this );
      this._anim.on('change:dir', this.onAnimationDirectionChange, this );

      this._frame.x = this._frameIndex * this._frame.width;
      this._texture.setFrame( this._frame );
    }

    PUBLIC_PROPS.forEach( prop => {
      if ( cfg.hasOwnProperty( prop ) )
        this[ prop ] = cfg[ prop ];
    });

    if ( this.game.editMode || cfg.interactive != false ) {
      this._sprite.interactive =  this._sprite.buttonMode = true;
      this._sprite.mouseover = this.onMouseOver.bind( this );
      this._sprite.mouseout = this.onMouseOut.bind( this );
      this._sprite.click = this.onClick.bind( this );
    }

  }

  get x () { return this._sprite.position.x; }
  set x ( value ) { this._sprite.position.x = value; }

  get y () { return this._sprite.position.y; }
  set y ( value ) { this._sprite.position.y = value; }

  get dir () { return this.scaleX / Math.abs( this.scaleX ); }
  set dir ( value ) { this._sprite.scale.x = Math.abs( this._sprite.scale.x ) * (value < 0 ? -1 : 1); }

  get width () { return this._frame.width; }
  set width ( value ) { this._frame.width = value; }

  get height () { return this._frame.height }
  set height ( value ) { this._frame.height = value; }

  get scaleX () { return this._sprite.scale.x; }
  set scaleX ( value ) { this._sprite.scale.x = value; }

  get scaleY () { return this._sprite.scale.y; }
  set scaleY ( value ) { this._sprite.scale.y = value; }

  get anchorX () { return this._sprite.anchor.x; }
  set anchorX ( value ) { this._sprite.anchor.x = value; }

  get anchorY () { return this._sprite.anchor.y; }
  set anchorY ( value ) { this._sprite.anchor.y = value; }

  get visible () { return this._sprite.visible; }
  set visible ( value ) { this._sprite.visible = !! value }

  get interactive () { return this._sprite.interactive; }
  set interactive ( value ) { this._sprite.interactive = !! value; }

  get tint () { return this._sprite.tint.toString(16).toUpperCase(); }
  set tint ( value ) { this._sprite.tint = parseInt( value, 16 ); }

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
    this._frame.x    = this._frameIndex * this.width;
    this._texture.setFrame( this._frame );

  }

  set ( prop, value ) {

    if ( this._anim.attributes.hasOwnProperty( prop ) )
      this._anim.set( prop, value );

    else if ( this.hasOwnProperty( prop ) ) {
      if ( typeof value === typeof this[ prop ] )
        this[ prop ] = value;
      else
        console.error( this.id + '\'s property ' + prop + ': value types do not match.');
    }

  }

  speak ( speech ) {

    this.game.speaker.speak( this, speech );

  }

  moveTo ( destination ) {

    this.game.mover.moveTo ( this, destination );

  }

  update ( timelapse ) {

    var dir = this.dir;

    if ( ! this.game.editMode )
      this.game.mover.update ( this, timelapse );

    if ( ! this.visible ) {
      if ( this.x + ( this.width * this.anchorX ) > this.game.scene.viewport.x
        && this.x - ( this.width * this.anchorX ) < this.game.scene.viewport.x + this.game.scene.viewport.width ) {
          this.visible = true;
      }
    }
    else {
      if ( this.x + ( this.width * this.anchorX ) < this.game.scene.viewport.x
        || this.x - ( this.width * this.anchorX ) > this.game.scene.viewport.x + this.game.scene.viewport.width ) {
          this.visible = false;
      }
    }

  }

  editablePropertyKeys () {

    return PUBLIC_PROPS.slice(0);

  }

  toJSON () {

    var obj = {};

    PUBLIC_PROPS.forEach( prop => {
      obj[ prop ] = this[ prop ];
    });

    // if ( this.states )
    //   obj.states = this.states.slice(0);

    return obj;

  }

  toString () {

    return JSON.stringify( this.toJSON() );

  }

  destroy () {

     this._sprite.removeStageReference();

  }

}