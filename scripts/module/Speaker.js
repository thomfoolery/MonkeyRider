'use strict';

import _ from 'lodash';

var G;

var FONT_SIZE = 6;
var FONT_COLOR = 'ffffff';
var WORD_WRAP_WIDTH = 50;

var Speaker = {

  init: function ( game ) {

    G = game;

    this._textContainer             = new PIXI.Container();
    this._textContainer.position    = new PIXI.Point( 0, - this._sprite.height );

    this._container.addChild( this._textContainer );

  },

  speak: function ( speech ) {

    if ( ! speech || speech.length === 0) return; // exit

    if ( _.isArray( speech ) ) {
      this.chooseSpeech ( speech );
      return; // exit
    }

    this.speech = speech;
    this._textContainer.removeChildren();

    var sprite = new PIXI.Text( this.speech, {
      font: FONT_SIZE + "px monospace",
      fill: '#' + ( this.speechColor || FONT_COLOR ),
      stroke: 'black',
      strokeThickness: 2,
      lineHeight: FONT_SIZE * 1.2,
      wordWrap: true,
      wordWrapWidth: WORD_WRAP_WIDTH
    });

    sprite.anchor.y   = 1;
    sprite.resolution = GAME.viewport.resolution;

    this._textContainer.addChild( sprite );

  },

  chooseSpeech: function ( speechOptions ) {

    G.menu.setOptions( speechOptions );

  },

  clearSpeech: function () {

    this.speech = null;
    this._textContainer.removeChildren();

  }

}

export default Speaker;