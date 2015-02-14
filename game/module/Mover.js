export class Mover {

  constructor ( game ) {

    this.game = game;

  }

  moveTo ( entity, destination ) {

    if ( this.game.director._state.get('act')
      || ( isNaN( destination.x ) && destination.x != null )
      || ( isNaN( destination.y ) && destination.y != null ) ) return;

    var dir = ( entity.x > destination.x ) ? -1 : 1 ;

    if ( entity.dir != dir )
      entity.scaleX = Math.abs( entity.scaleX ) * dir;

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

      distance = entity.scaleX * ( timelapse / 1000 ) * entity.states[ entity._anim.get('state') ].speed;
      entity.x += distance;

      // destination reached
      if ( Math.abs( entity.x - entity.destination.x ) <= distance
        || ( entity.scaleX == 1 && entity.x > entity.destination.x )
        || ( entity.scaleX == -1 && entity.x < entity.destination.x ) ) {

        entity.x = entity.destination.x;
        entity._anim.set( entity._anim.defaults );
        entity.destination.x = null;
        entity.phase = 0;

        entity._frameIndex = entity.states[ entity._anim.get('state') ].start;
        entity.game.director.startActing();

      }

      entity._frame.x = entity._frameIndex * Math.abs( entity.width );
      entity._texture.setFrame( entity._frame );

    }

  }

}