'use strict';

import {Entity} from 'game/module/Entity';

export class Player extends Entity {

  constructor ( cfg, game ) {

    super.constructor( cfg, game );

    this.id = 'player';

    // mouseout
    this.game.messenger.subscribe('scene/mouseup', position => {
      if ( ! this.game.editMode )
        this.moveTo( position );
    });

  }

  addDirector( director ) {

    this.director = director;

  }

  update ( timelapse ) {

    super.update( timelapse );

  }

  receiveItem ( itemID ) {

    var item = this.game.scene.getItem( itemID );
    this.game.controls.inventory.add( item );

  }

}