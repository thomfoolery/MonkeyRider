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

  constructor ( cfg, game ) {

    G = game;

    super( cfg, game );

    this.id = 'player';
    this.action = null;

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

  update ( timelapse ) {

    if ( G.input.keys[ G.input.KEY.LEFT ]
      && G.input.keys[ G.input.KEY.RIGHT ] ) {
      this.dir = 0;
    }

    else if ( G.input.keys[ G.input.KEY.LEFT ] ) {
      if ( this.dir > -1 ) this.dir = -1;
      this.destination.x = this.position.x - 5
    }

    else if ( G.input.keys[ G.input.KEY.RIGHT ] ) {
      if ( this.dir < 1 ) this.dir = 1;
      this.destination.x = this.position.x + 5
    }

    else if ( G.input.keys[ G.input.KEY.DOWN ] ) {
      this.state = 'stand.face';
    }

    else if ( G.input.keys[ G.input.KEY.UP ] ) {
      this.state = 'stand.back';
    }

    else if ( G.input.keys[ G.input.KEY.SELECT ] ) {

      var sprite = this.getClosestActionable();

      delete G.input.keys[ G.input.KEY.SELECT ];

      if ( sprite )
        return G.menu.setActionText( sprite.id );
    }

    super.update( timelapse );

  }

}