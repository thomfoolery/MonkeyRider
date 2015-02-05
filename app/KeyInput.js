var KeyInput = {};

document.addEventListener('keydown', function ( e ) {
  KeyInput.keyCode = e.keyCode;
});
document.addEventListener('keyup', function ( e ) {
  KeyInput.keyCode = null;
});

export default KeyInput;

/*
    // NO KEY
    if ( this.keyInput.keyCode === null ) {
      // WALKING
      if ( this.state == 'walking' ) {
        this.state = 'default';
        this.frameIndex = this.states[ this.state ].start;
      }
    }
    // KEY
    else {
      // SPACE
      if ( this.keyInput.keyCode === 32 ) {
        this.state = 'knocking';
        this.frameIndex = this.states[ this.state ].start;
      }
      // UP
      else if ( this.keyInput.keyCode === 38 ) {
        this.state = 'standBacking';
        this.frameIndex = this.states[ this.state ].start;
      }
      // DOWN
      else if ( this.keyInput.keyCode === 40 ) {
        this.state = 'standFacing';
        this.frameIndex = this.states[ this.state ].start;
      }

      // LEFT or RIGHT
      if ( this.keyInput.keyCode === 37 || this.keyInput.keyCode === 39) {
        if ( this.state != 'walking' ) {
          this.frameIndex = this.states['walking'].start;
          this.phase = 0;
        }

        this.phase += timelapse;
        this.state = 'walking';

        // LEFT
        if ( this.keyInput.keyCode === 37 )
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