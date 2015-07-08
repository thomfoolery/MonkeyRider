'use strict';

import Backbone from 'backbone';

var G;

var FONT_SIZE = 10;
var LINE_HEIGHT = FONT_SIZE * 1.1;
var IGNORE_DURATION = 150;

var StateModel = Backbone.Model.extend({
  defaults: {
    index: null,
    options: null
  }
});

var ignoreKeys = {};

export class Menu {

  constructor ( game, cfg ) {

    G = game;

    this._state = new StateModel();

    this.width   = G.viewport.width;
    this.height  = cfg.height || 50;

    this.bgColor = cfg.bgColor || 0x111111;

    this.view            = new PIXI.Container();
    this.view.position.y = G.viewport.height - this.height;

    this.bg = new PIXI.Graphics();
    this.bg.beginFill( this.bgColor );
    this.bg.drawRect( 0, 0, this.width, this.height );
    this.bg.endFill();

    this.optionText          = new PIXI.Container();
    this.optionText.position = new PIXI.Point( this.width /2, 0 );
    this.optionText.mask     = this.bg;

    this.view.addChild( this.bg );
    this.view.addChild( this.optionText );

    G.stage.addChild( this.view );

    this._state.on('change:index',   this.onChangeIndex, this );

  }

  open () {

    G.input.mode = 'menu';
    history.pushState('menu', 'menu' );

  }

  close () {

    this.reset();
    history.back();

  }

  setOptions ( options ) {

    if ( ! options || options.length === 0 ) return; // exit

    this._state.set({
      index: 0,
      options: options
    }, { silent: true });

    this.open();
    this.draw();

  }

  onChangeIndex () {

    if ( ! this._state.get('options') ) return; // exit

    var newIndex = this._state.get('index');
    var oldIndex = this._state.previous('index');
    var options  = this._state.get('options');

    if ( newIndex > options.length -1 )
      this._state.set('index', options.length -1 );

    if ( newIndex < 0 )
      this._state.set('index', 0 );

    this.draw();

  }

  draw ( options ) {

    this.clear();

    options = this._state.get('options');

    if ( ! options || options.length === 0 )
      return; // exit

    var sprite = this._state.get('sprite');
    var currentIndex = this._state.get('index');
    options.forEach( ( option, index ) => {

        var textStyle = {
            font: FONT_SIZE + 'px monospace',
            fill: index == currentIndex ? 'white' : 'lime'
        };

        var textSprite        = new PIXI.Text( option.text, textStyle );

        textSprite.resolution = GAME.viewport.resolution;
        textSprite.position   = new PIXI.Point( 0.5, index * LINE_HEIGHT );
        textSprite.anchor     = new PIXI.Point( 0.5, 0 );

        this.optionText.addChild( textSprite );
    });

    this.optionText.position.y = ( FONT_SIZE * 1.5 ) - ( this._state.get('index') * LINE_HEIGHT );
  }

  update () {

    var k = G.input.keys;
    var _ = G.input.KEY;

    if ( G.input.mode === 'menu' ) {

      var index   = this._state.get('index');
      var options = this._state.get('options');

      if ( k[ _.DOWN ] ) {
        if ( ignoreKey( _.DOWN ) ) return; // exit

        this._state.set('index', ++index );
        ignoreKey( _.DOWN, IGNORE_DURATION );
      }

      if ( k[ _.UP ] ) {
        if ( ignoreKey( _.UP ) ) return; // exit

        this._state.set('index', --index );
        ignoreKey( _.UP, IGNORE_DURATION );
      }

      if ( k[ _.SELECT ] ) {
        if ( ignoreKey( _.SELECT ) ) return; // exit

        var option = options[ index ];

        G.player.perform( option.action, option.id );

        this.close();
        G.input.clear( _.SELECT );
        ignoreKey( _.SELECT, IGNORE_DURATION );
      }
    }

    function ignoreKey ( key, time ) {
      if ( time )
        return ignoreKeys[ key ] = Date.now() + time;
      else if ( ignoreKeys[ key ] && Date.now() < ignoreKeys[ key ] )
        return true;
      return false;
    }
  }

  clear () {

    this.optionText.removeChildren();

  }

  reset () {

    this.clear();
    this._state.set( this._state.defaults );

  }

  destroy () {

  }

}