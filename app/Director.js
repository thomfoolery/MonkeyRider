'use strict';

import Backbone from 'backbone';

var StateModel = Backbone.Model.extend({
  defaults: {
    actIndex: 0,
    entity:   null,
    actor:    null,
    act:      null
  }
});

class Director {

  constructor ( game ) {

    this.game = game;

    this._state = new StateModel();

  }

  startActing () {

    // console.log('start acting');

    var active = this.game.controls._state.get('isActive');

    if ( ! active ) return;

    var act;
    var action = this.game.controls._state.get('action');
    var entity = this._state.get('entity');

    if ( ! action || ! entity )
      return this.game.controls._state.set('isActive', false );

    if ( ! this.game.sceneScript[ entity.id ]
      || ! this.game.sceneScript[ entity.id ][ action ] ) {

      act = [{
        "actor": "player",
        "action": "speak",
        "value": [
          "I could but",
          "I won't"
        ]
      }];
    }
    else {

      let script = this.game.sceneScript[ entity.id ][ action ];

      if ( script.length < 2 )
        act = script[0].act;
      else
        act = script.shift().act;
    }

    var actor = ( act[0].actor === 'entity' ) ? entity : this.game.player;
    var actPhase = act[0];

    this.timelapsed = 0;

    act.forEach( function ( actPhase ) {
      actPhase.complete = false;
    });

    this._state.set('act', act );
    this._state.set('actor', actor );
    this._state.set('actIndex', 0 );

    this.act( actor, actPhase );

  }

  complete () {

    this._state.set('act', null );
    this._state.set('actor', null );
    this._state.set('actIndex', null );
    this._state.set( this._state.defaults );
    this.game.controls._state.set( this.game.controls._state.defaults );

  }

  update ( timelapse ) {

    this.game.player.update( timelapse );

    var act = this._state.get('act');

    if ( ! act ) return;

    var actIndex = this._state.get('actIndex');
    var actPhase = act[ actIndex ];

    if ( actPhase.complete == true )
      return;

    var actor = this._state.get('actor');

    // phase complete
    if ( ! actPhase.duration || actPhase.duration - this.timelapsed <= 0 ) {

      this.timelapsed = 0;
      actPhase.complete = true;

      if ( actPhase.action == 'speak')
        actor[ actPhase.action ]( null );

      actPhase = act[ ++actIndex ];

      // act complete
      if ( ! actPhase )
        return this.complete();

      this.next( act, actor, actPhase, actIndex );

      return;
    }

    this.timelapsed += timelapse;

  }

  next ( act, actor, actPhase, actIndex ) {

    actor = ( actPhase.actor === 'entity' ) ?
      this._state.get('entity') :
      this.game.player
    ;

    this._state.set('actIndex', actIndex );
    this._state.set('actor', actor );
    this.act( actor, actPhase );

  }

  act ( actor, actPhase ) {

    if ( ! actPhase.duration && actPhase.action == 'speak' )
      actPhase.duration = Math.min( 1500, actPhase.value.join(' ').length * 120 );

    var [ action, prop ] = actPhase.action.split(':');

    if ( prop )
      actor[ action ]( prop, actPhase.value );
    else
      actor[ action ]( actPhase.value );

  }

}

export default Director;