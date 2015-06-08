var G;

export class Mover {

  constructor ( game ) {

    G = game;
  }

  moveTo ( sprite, destination ) {

    if ( ( isNaN( destination.x ) && destination.x != null )
      || ( isNaN( destination.y ) && destination.y != null ) ) return;

    var dir = ( sprite.x > destination.x ) ? -1 : 1 ;

    if ( sprite.dir != dir )
      sprite.scaleX = Math.abs( sprite.scaleX ) * dir;

    sprite.destination = destination;

  }

  update ( sprite, timelapse ) {

    if ( sprite.destination.x ) {

      var distance = sprite.scaleX * ( timelapse / 1000 ) * sprite.speed;

      if ( sprite.position.x + distance < Math.abs( sprite.width/2 )
        || sprite.position.x + distance > G.scene.width - Math.abs( sprite.width/2 ) ) {

        if ( sprite.position.x + distance < Math.abs( sprite.width/2 ) )
          sprite.position.x = Math.abs( sprite.width/2 );
        else if ( sprite.position.x + distance > G.scene.width - Math.abs( sprite.width/2 ) )
          sprite.position.x = G.scene.width - Math.abs( sprite.width/2 );

        sprite.destination.x = null;
        sprite.state = 'default';
        return;// exit
      }

      if ( sprite.state != 'walking' )
        return sprite.state = 'walking';

      sprite.x += distance;

      // destination reached
      if ( Math.abs( sprite.x - sprite.destination.x ) <= distance / 2
        || ( sprite.scaleX == 1 && sprite.x > sprite.destination.x )
        || ( sprite.scaleX == -1 && sprite.x < sprite.destination.x ) ) {

        sprite.x = sprite.destination.x;
        sprite.destination.x = null;
        sprite.state = 'default';

      }

    }

  }

  destroy () {

  }

}