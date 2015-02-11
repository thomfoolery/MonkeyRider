export class Speaker {

  constructor ( game ) {

    this._textContainer = new PIXI.DisplayObjectContainer();

    this.game = game;

  }

  speak ( actor, speech ) {

    this._textContainer.removeChildren();

    if ( actor.speech = speech ) {

      let offset = 0;
      let cfg = {
        font: "5px monospace",
        fill: actor.speechColor,
        stroke: 'black',
        strokeThickness: 2
      };

      actor.speech.forEach( function ( line, index ) {

        var textSprite = new PIXI.Text( line, cfg );

        textSprite.resolution = 3;
        textSprite.anchor.x = 0;
        textSprite.anchor.y = 0;
        textSprite.y = index * 6;

        offset += 6;

        this._textContainer.addChild( textSprite );

      }.bind( this ));

      this._textContainer.position.x = actor._sprite.position.x;
      this._textContainer.position.y = actor._sprite.position.y - actor._sprite.height - offset - 2;

      actor._sprite.parent.addChild( this._textContainer );
    }
    else {
      actor._sprite.parent.removeChild( this._textContainer );
    }

  }

}