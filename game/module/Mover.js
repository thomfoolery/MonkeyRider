export class Mover {

  constructor ( game ) {

    this.game = game;

  }

  moveTo ( sprite, destination ) {

    if ( this.game.director._state.get('act')
      || ( isNaN( destination.x ) && destination.x != null )
      || ( isNaN( destination.y ) && destination.y != null ) ) return;

    var dir = ( sprite.x > destination.x ) ? -1 : 1 ;

    if ( sprite.dir != dir )
      sprite.scaleX = Math.abs( sprite.scaleX ) * dir;

    sprite.destination = destination;

  }

  update ( sprite, timelapse ) {

    if ( sprite.destination.x ) {

      let distance;

      if ( sprite.state != 'walking' )
        return sprite.state = 'walking';

      distance = sprite.scaleX * ( timelapse / 1000 ) * sprite.speed;
      sprite.x += distance;

      // destination reached
      if ( Math.abs( sprite.x - sprite.destination.x ) <= distance / 2
        || ( sprite.scaleX == 1 && sprite.x > sprite.destination.x )
        || ( sprite.scaleX == -1 && sprite.x < sprite.destination.x ) ) {

        sprite.x = sprite.destination.x;
        sprite.destination.x = null;
        sprite.state = 'default';

        sprite.game.director.startActing();

      }

    }

  }

}