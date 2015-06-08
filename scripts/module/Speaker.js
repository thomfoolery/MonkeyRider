var FONT_SIZE = 6;
var MAX_LINE_LENGTH = 15;

export class Speaker {

  constructor ( game ) {

    this._textContainer = new PIXI.Container();

    this.game = game;

  }

  speak ( actor, speech ) {

    this._textContainer.removeChildren();

    if ( actor.speech = speech ) {

      let tmp = actor.speech.split(' ');
      actor.speech = [''];
      tmp.forEach( word => {
        var len  = actor.speech.length;
        var line = actor.speech[ len -1 ];
        if ( line.length + word.length < MAX_LINE_LENGTH )
          actor.speech[ len -1 ] = actor.speech[ len -1 ] + word + ' ';
        else
          actor.speech.push( word + ' ' );
      });

      let offset = 0;
      let cfg = {
        font: FONT_SIZE + "px monospace",
        fill: '#' + actor.speechColor,
        stroke: 'black',
        strokeThickness: 2
      };

      actor.speech.forEach( function ( line, index ) {

        var textSprite = new PIXI.Text( line, cfg );

        textSprite.resolution = 3;
        textSprite.anchor.x = 0;
        textSprite.anchor.y = 0;
        textSprite.y = index * ( FONT_SIZE + 1 );

        offset += 6;

        this._textContainer.addChild( textSprite );

      }.bind( this ));

      this._textContainer.position.x = actor.x;
      this._textContainer.position.y = actor.y - actor.height - offset - 2;

      actor._sprite.parent.addChild( this._textContainer );
    }
    else {
      actor._sprite.parent.removeChild( this._textContainer );
    }

  }

  destroy () {

    this._textContainer.removeStageReference();

  }

}