import Entity from 'app/Entity';

class Player extends Entity {

  constructor ( cfg, stage, keyInput ) {

    super.constructor( cfg, stage );

    this._keyInput = keyInput;

    this.states = cfg.states;
    this.state  = cfg.state  || 'standFacing';
    this.dir    = cfg.dir    || 1;

    this.currFrame = this.states[ this.state ].start;

    this._sprite.interactive = false;
    this._sprite.buttonMode  = false;

  }

  update ( timelapse ) {

    // NO KEY
    if ( this._keyInput.keyCode === null ) {
      // WALKING
      if ( this.state == 'walking' ) {
        this.state = 'standing';
        this.currFrame = this.states[ this.state ].start;
      }
    }
    // KEY
    else {
      // SPACE
      if ( this._keyInput.keyCode === 32 ) {
        this.state = 'knocking';
        this.currFrame = this.states[ this.state ].start;
      }
      // UP
      else if ( this._keyInput.keyCode === 38 ) {
        this.state = 'standBacking';
        this.currFrame = this.states[ this.state ].start;
      }
      // DOWN
      else if ( this._keyInput.keyCode === 40 ) {
        this.state = 'standFacing';
        this.currFrame = this.states[ this.state ].start;
      }

      // LEFT or RIGHT
      if ( this._keyInput.keyCode === 37 || this._keyInput.keyCode === 39) {
        if ( this.state != 'walking' ) {
          this.currFrame = this.states['walking'].start;
          this.phase = 0;
        }

        this.phase += timelapse;
        this.state = 'walking';

        // LEFT
        if ( this._keyInput.keyCode === 37 )
          this.dir = -1;
        // RIGHT
        else
          this.dir = 1;

        this._sprite.scale.x = this.scale * this.dir;

        if ( this.phase > this.states['walking'].phaseLength ) {
          this.currFrame++;
          this.phase = 0;
        }

        if ( this.currFrame > this.states['walking'].frameCount ) {
          this.currFrame = this.states['walking'].start;
        }

        this._sprite.position.x += this.dir * ( timelapse / 1000 ) * this.states[ this.state ].speed;
      }
    }

    this._texture.setFrame({
      x: this.currFrame * this.width,
      y: 0,
      width: this.width,
      height: this.height
    });

    super.update( timelapse );

  }

}

export default Player;