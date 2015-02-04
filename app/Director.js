import Backbone from 'backbone';

class Director {

  constructor ( player, script, controls ) {

    this.player   = player;
    this.script   = script;
    this.controls = controls

    var StateModel = Backbone.Model.extend({
      defaults: {
        actIndex: 0,
        entity:   null,
        actor:    null,
        act:      null
      }
    });

    this._state = new StateModel();
  }

  startAct ( entity, action ) {

    if ( ! entity
      || ! this.script[ entity.id ]
      || ! this.script[ entity.id ][ action ] ) return;

    var i = 0;
    var act = this.script[ entity.id ][ action ];
    var actor = ( act[ i ].actor === 'entity' ) ? entity : this.player;
    var actPhase = act[ i ];

    this.timelapsed = 0;

    act.forEach( function ( actPhase ) {
      actPhase.complete = false;
    });

    this._state.set('act', act );
    this._state.set('actor', actor );
    this._state.set('actIndex', i );

    this.act( actor, act[ i ] );

  }

  update ( timelapse ) {

    this.player.update( timelapse );

    var act = this._state.get('act');

    if ( ! act ) return;

    var actIndex = this._state.get('actIndex');
    var actPhase = act[ actIndex ];

    if ( actPhase.complete == true )
      return;

    var actor = this._state.get('actor');

    if ( actPhase.duration - this.timelapsed <= 0 ) {
      this.timelapsed = 0;
      actPhase.complete = true;
      this.next( act, actor, actPhase, actIndex );
      return;
    }

    this.timelapsed += timelapse;

  }

  next ( act, actor, actPhase, actIndex ) {

    if ( actPhase.action == 'speak')
      actor[ actPhase.action ]( null );

    actPhase = act[ ++actIndex ];

    if ( ! actPhase ) {
      this._state.set('act', null );
      this._state.set('actor', null );
      this._state.set('actIndex', null );
      this._state.set( this._state.defaults );
      this.controls._state.set( this.controls._state.defaults );
      return;
    }

    actor = actPhase.actor === 'entity' ?
      this._state.get('entity') :
      this.player
    ;

    this._state.set('actor', actor );
    this._state.set('actIndex', actIndex );
    this.act( actor, actPhase );

  }

  act ( actor, actPhase ) {

    if ( ! actPhase.duration && actPhase.action == 'speak' )
      actPhase.duration = Math.min( 1500, actPhase.value.join(' ').length * 120 );

    actor[ actPhase.action ]( actPhase.value );

  }

}

export default Director;