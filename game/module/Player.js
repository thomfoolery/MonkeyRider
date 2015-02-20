'use strict';

import {Sprite} from 'game/module/Sprite';

export class Player extends Sprite {

  constructor ( cfg, game ) {

    super.constructor( cfg, game );

    this.id = 'player';

    // mouseout
    this.game.messenger.subscribe('scene/mouseup', position => {
      this.moveTo( position );
    });

    // click sprite
    this.game.messenger.subscribe('sprite/click', sprite => {
      this.moveTo( {
        x: sprite.x,
        y: sprite.y
      });
    });

  }

  addDirector( director ) {

    this.director = director;

  }

  update ( timelapse ) {

    super.update( timelapse );
    // console.log( this.animState );

  }

  receiveItem ( itemID ) {

    var item = this.game.scene.getItem( itemID );
    this.game.controls.inventory.add( item );

  }

}