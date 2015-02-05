'use strict';

import Entity from 'app/Entity';
import keyInput from 'app/KeyInput';

class Player extends Entity {

  constructor ( cfg, game ) {

    super.constructor( cfg, game );

    this.id = 'player';

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

export default Player;