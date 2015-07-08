'use strict';

var G;

import Backbone from 'backbone';

var StateModel = Backbone.Model.extend({
  defaults: {
    actIndex: 0,
    sprite:   null,
    actor:    null,
    act:      null
  }
});

export class Director {

  constructor ( game ) {

    G = game;

    this._state = new StateModel();

  }

  isActing () {

    return !! this._state.get('act');

  }

  start ( script ) {

    if ( ! script ) return;

    var actPhase = script[0];
    var actor = G.scene.sprites[ actPhase.actor ];

    this.timelapsed = 0;

    script.forEach( function ( actPhase ) {
      actPhase.complete = false;
    });

    this._state.set('act', script );
    this._state.set('actor', actor );
    this._state.set('actIndex', 0 );

    this.act( actor, actPhase );

  }

  act ( actor, actPhase ) {

    if ( ! actPhase.duration && actPhase.action == 'speak' )
      actPhase.duration = Math.max( 1000, Math.min( 3000, actPhase.value.length * 120 ) );

    var [ action, prop ] = actPhase.action.split(':');

    this._state.set('actPhase', actPhase )

    if ( prop )
      actor[ action ]( prop, actPhase.value );
    else
      actor[ action ]( actPhase.value );

  }

  update ( timelapse ) {

    if ( G.player )
      G.player.update( timelapse );

    var act = this._state.get('act');

    if ( ! act ) return; // exit

    var actIndex = this._state.get('actIndex');
    var actPhase = act[ actIndex ];

    if ( actPhase.complete ) return; // exit

    var actor = this._state.get('actor');

    // phase complete
    if ( ! actPhase.duration || actPhase.duration - this.timelapsed <= 0 ) {

      this.timelapsed = 0;
      actPhase.complete = true;

      if ( actPhase.action == 'speak')
        actor.clearSpeech();

      actPhase = act[ ++actIndex ];

      // act complete
      if ( ! actPhase )
        this.complete();
      // next act
      else
        this.next( act, actPhase, actIndex );

    }
    else {

      this.timelapsed += timelapse;

    }

  }

  next ( act, actPhase, actIndex ) {

    var actor = G.scene.sprites[ actPhase.actor ];

    this._state.set('actIndex', actIndex );
    this._state.set('actor', actor );
    this.act( actor, actPhase );

  }

  complete () {

    if ( this._state.get('actPhase').action === 'speak' )
      G.player.clearSpeech();

    this._state.set('act', null );
    this._state.set('actor', null );
    this._state.set('actIndex', null );
    this._state.set( this._state.defaults );

    var target = G.player._target;

    target.animState = 'default';

  }

  destroy () {

  }

}