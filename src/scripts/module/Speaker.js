'use strict';

import _ from 'lodash';
import Game from 'game/module/Game';
import Menu from 'game/module/Menu';
import Director from 'game/module/Director';

var FONT_SIZE = 6;
var FONT_COLOR = 'ffffff';
var WORD_WRAP_WIDTH = 50;

var Speaker = {

  init: function () {

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
    sprite.resolution = Game.viewport.resolution;

    this._textContainer.addChild( sprite );

  },

  chooseSpeech: function ( speechOptions ) {

    Director.pause();

    speechOptions = speechOptions.filter( ( option ) => {
      return testConditions.call( this, option.conditions );
    });

    Menu.setOptions( speechOptions );

  },

  clearSpeech: function () {

    this.speech = null;
    this._textContainer.removeChildren();

  }

}

/**
 * @param  Array condition [a collection of conditions that must be satisfied to return true]
 * @return Boolean
 */
function testConditions ( conditions ) {
  if ( ! conditions ) return true;

  var isSatisfied = true;

  conditions.forEach( condition => {

    var [ test, value ] = condition.split(':');

    if ( ! this[ test ]( value ) )
      isSatisfied = false;

  });

  return isSatisfied;
}

export default Speaker;