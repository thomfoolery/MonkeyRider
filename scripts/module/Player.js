'use strict';

import {Sprite} from 'game/module/Sprite';

var G;

var ACTIONS = [
  'look at',
  'pick up',
  'talk to',
  'close',
  'open',
  'push'
]

var DEFAULT_ACTION = ACTIONS[0];

export class Player extends Sprite {

  constructor ( game, cfg ) {

    G = game;

    super( cfg, game );

    this.id = 'player';

  }

  getClosestActionable () {

    var sprite;
    var self = this;
    var diff = 999999;

    G.scene.actionables.forEach( function ( _sprite ) {
      if ( _sprite == self ) return;// exit
      if ( self.position.x <= _sprite.position.x - Math.abs(_sprite.width*_sprite.anchor.x) ) return;// exit
      if ( self.position.x >= _sprite.position.x + Math.abs(_sprite.width*(1-_sprite.anchor.x)) ) return;// exit

      var newDiff = Math.abs( self.position.x - _sprite.position.x );
      if ( newDiff < diff ) {
        sprite = _sprite;
        diff = newDiff
      }
    });

    return sprite;
  }

  select () {

    this._target = this.getClosestActionable();

    var options = G.script.getActions( this._target )
      .map( function ( action ) {
        return {
          text: action + ' ' + this._target.name,
          action: action
        }
      }, this )
    ;

    G.menu.setOptions( options );

  }

  perform( action, id = 'default' ) {

    if ( ! action ) return; // exit

    var script = G.script.getScript( this._target, action, id );

    G.director.start( script );

  }

  update ( timelapse ) {

    var k = G.input.keys;
    var _ = G.input.KEY;

    if ( G.input.mode === 'player' && ! G.director.isActing() ) {

      if ( k[ _.LEFT ]
        && k[ _.RIGHT ] ) {
        this.dir = 0;
      }

      if ( k[ _.LEFT ] ) {
        if ( this.dir > -1 ) this.dir = -1;
        this.destination.x = this.position.x - 5
      }

      if ( k[ _.RIGHT ] ) {
        if ( this.dir < 1 ) this.dir = 1;
        this.destination.x = this.position.x + 5
      }

      if ( k[ _.DOWN ] ) {
        this.state = 'stand.face';
      }

      if ( k[ _.UP ] ) {
        this.state = 'stand.back';
      }

      if ( k[ _.SELECT ] ) {

        delete k[ _.SELECT ];

        if ( G.editor.isEditing )
          G.editor.close();

        this.select();

      }
    }

    super.update( timelapse );

  }

  reset () {

    this._target = null;

  }

}