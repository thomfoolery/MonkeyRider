'use strict';

import Game from 'game/module/Game';
import Menu from 'game/module/Menu';
import Input from 'game/module/Input';
import Sprite from 'game/module/Sprite';
import Director from 'game/module/Director';

var ACTIONS = [
  'look at',
  'pick up',
  'talk to',
  'close',
  'open',
  'push'
]

var DEFAULT_ACTION = ACTIONS[0];

export default class Player extends Sprite {

  constructor ( cfg ) {

    super( cfg );

    this.id = 'player';
    this.inventory = [];

  }

  getClosestActionable () {

    var sprite;
    var self = this;
    var diff = 999999;

    Game.scene.actionables.forEach( function ( _sprite ) {
      if ( _sprite == self
        || self.position.x <= _sprite.position.x - Math.abs(_sprite.width*_sprite.anchor.x)
        || self.position.x >= _sprite.position.x + Math.abs(_sprite.width*(1-_sprite.anchor.x)) )
        return;// exit

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

    var options = Game.script.getActions( this._target )
      .map( function ( action ) {
        return {
          text: action + ' ' + this._target.name,
          action: action
        }
      }, this )
    ;

    Menu.setOptions( options );

  }

  perform ( action, id = 'default' ) {

    if ( ! action ) return; // exit

    var script = Game.script.getScript( this._target, action, id );

    Director.start( script );

  }

  receive ( object ) {

    if ( ! this.has( object.id ) )
      this.inventory.push( object );

  }

  has ( objectId, invert = false ) {

    var pass = false;

    if ( objectId[0] === '!' ) {
      invert   = true;
      objectId = objectId.substr(1);
    }

    this.inventory.forEach( ( obj ) => {
      if ( obj.id === objectId ) pass = true;
    });

    return ( invert ) ? ! pass : pass ;
  }

  update ( timelapse ) {

    var k = Input.keysPressed;
    var _ = Input.keyMappings;

    if ( Input.mode === 'play' && ! Director.isActing ) {

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
        Input.clear( _.SELECT );
        this.select();
      }
    }

    super.update( timelapse );

  }

  reset () {

    this._target = null;

  }

}