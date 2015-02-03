import Entity from 'app/Entity';

class Player extends Entity {

  constructor ( cfg, scriptor, keyInput ) {

    cfg.id = 'player';

    super.constructor( cfg, scriptor );

    this.destination = {
      x: null,
      y: null
    };

    this._sprite.interactive = false;
    this._sprite.buttonMode  = false;

    this._keyInput = keyInput;

  }

  addScriptor ( scriptor ) {

    this.scriptor = scriptor;

  }

  setDestination ( dest ) {

    if ( ( isNaN( dest.x ) && dest.x != null )
      || ( isNaN( dest.y ) && dest.y != null ) ) return;

    this.destination = dest;

  }

  update ( timelapse ) {

    if ( this.destination.x != null
      && this._sprite.position.x != this.destination.x ) {

      let distance;

      if ( this.state != 'walking' ) {
        this.frameIndex = this.states['walking'].start;
        this.state = 'walking';
        this.phase = 0;
      }

      this.phase += timelapse;

      if ( this._sprite.position.x > this.destination.x )
        this.dir = -1;
      else
        this.dir = 1;

      this._sprite.scale.x = this.scale * this.dir;

      if ( this.phase > this.states['walking'].phaseLength ) {
        this.frameIndex++;
        this.phase = 0;
      }

      if ( this.frameIndex > this.states['walking'].frameCount ) {
        this.frameIndex = this.states['walking'].start;
      }

      distance = this.dir * ( timelapse / 1000 ) * this.states[ this.state ].speed;
      this._sprite.position.x += distance;

      if ( Math.abs( this._sprite.position.x - this.destination.x ) < 2 ) {
        this._sprite.position.x = this.destination.x;
        this.destination.x = null;
        this.state = 'default';
        this.phase = 0;

        this.frameIndex = this.states[ this.state ].start;
        this.scriptor.startAct();
      }

      this._frame.x = this.frameIndex * this.width;
      this._texture.setFrame( this._frame );

    }
/*
    // NO KEY
    if ( this._keyInput.keyCode === null ) {
      // WALKING
      if ( this.state == 'walking' ) {
        this.state = 'default';
        this.frameIndex = this.states[ this.state ].start;
      }
    }
    // KEY
    else {
      // SPACE
      if ( this._keyInput.keyCode === 32 ) {
        this.state = 'knocking';
        this.frameIndex = this.states[ this.state ].start;
      }
      // UP
      else if ( this._keyInput.keyCode === 38 ) {
        this.state = 'standBacking';
        this.frameIndex = this.states[ this.state ].start;
      }
      // DOWN
      else if ( this._keyInput.keyCode === 40 ) {
        this.state = 'standFacing';
        this.frameIndex = this.states[ this.state ].start;
      }

      // LEFT or RIGHT
      if ( this._keyInput.keyCode === 37 || this._keyInput.keyCode === 39) {
        if ( this.state != 'walking' ) {
          this.frameIndex = this.states['walking'].start;
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
          this.frameIndex++;
          this.phase = 0;
        }

        if ( this.frameIndex > this.states['walking'].frameCount ) {
          this.frameIndex = this.states['walking'].start;
        }

        this._sprite.position.x += this.dir * ( timelapse / 1000 ) * this.states[ this.state ].speed;
      }
    }
*/

    super.update( timelapse );

  }

}

export default Player;