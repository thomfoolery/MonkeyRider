export class Mover {

  constructor ( game ) {

    this.game = game;

  }

  moveTo ( entity, destination ) {

    if ( ( isNaN( destination.x ) && destination.x != null )
      || ( isNaN( destination.y ) && destination.y != null ) ) return;

    var dir = ( entity._sprite.position.x > destination.x ) ? -1 : 1 ;

    entity._anim.set('dir', dir );
    entity._sprite.scale.x = entity.scale * dir;

    entity.destination = destination;

  }

  update ( entity, timelapse ) {

    if ( entity.destination.x ) {

      let distance;

      if ( entity._anim.get('state') != 'walking' ) {
        entity._frameIndex = entity.states['walking'].start;
        entity._anim.set('state','walking');
        entity.phase = 0;
      }

      entity.phase += timelapse;

      if ( entity.phase > entity.states['walking'].phaseLength ) {
        entity._frameIndex++;
        entity.phase = 0;
      }

      if ( entity._frameIndex > entity.states['walking'].frameCount ) {
        entity._frameIndex = entity.states['walking'].start;
      }

      distance = entity._anim.get('dir') * ( timelapse / 1000 ) * entity.states[ entity._anim.get('state') ].speed;
      entity._sprite.position.x += distance;

      // destination reached
      if ( Math.abs( entity._sprite.position.x - entity.destination.x ) <= distance
        || ( entity._anim.get('dir') == 1 && entity._sprite.position.x > entity.destination.x )
        || ( entity._anim.get('dir') == -1 && entity._sprite.position.x < entity.destination.x ) ) {

        entity._sprite.position.x = entity.destination.x;
        entity._anim.set( entity._anim.defaults );
        entity.destination.x = null;
        entity.phase = 0;

        entity._frameIndex = entity.states[ entity._anim.get('state') ].start;
        entity.game.director.startActing();

      }

      entity._frame.x = entity._frameIndex * entity.width;
      entity._texture.setFrame( entity._frame );

    }

  }

}