import Backbone from 'backbone';

class Scriptor {

  constructor ( player, scriptJSON, $actionPanel, $actionDescriptor, $inventoryPanel ) {

    this.DEFAULT_ACTION = 'look at';

    this._player = player;
    this._script = scriptJSON;

    this.$actionPanel      = $actionPanel;
    this.$inventoryPanel   = $inventoryPanel;
    this.$actionDescriptor = $actionDescriptor;

    this.$actionPanel.addEventListener('click', this.clickActionPanel.bind( this ));
    this.$actionDescriptor.innerHTML = this.DEFAULT_ACTION;

    // State

    var StateModel = Backbone.Model.extend({
      defaults: {
        action:   this.DEFAULT_ACTION,
        entity:   null,
        isActive: false
      }
    });

    this.state = new StateModel();

    this.state.on('change:action change:entity', function ( stateModel ) {

      var action = stateModel.get('action');
      var entity = stateModel.get('entity');

      var text = action.charAt( 0 ).toUpperCase() + action.substr( 1 );
          text += ( entity ? ' ' + entity.id.charAt( 0 ).toUpperCase() + entity.id.substr( 1 ) : '' );

      this.$actionDescriptor.innerHTML = text;

    }, this );

    this.state.on('change:isActive', function ( stateModel ) {

      if ( stateModel.get('isActive') )
        this.$actionDescriptor.classList.add('active');
      else
        this.$actionDescriptor.classList.remove('active');

    }, this );

  }

  clickActionPanel ( e ) {

    if ( e.target.tagName != 'A' ) return;
    this.state.set('action', e.target.innerHTML );

  }

  mouseOver ( entity ) {

    if ( this.state.get('isActive') || this.state.get('act') ) return;
    this.state.set('entity', entity );

  }

  mouseOut ( entity ) {

    if ( this.state.get('isActive') || this.state.get('act') ) return;
    this.state.set('entity', null );

  }

  startAct () {

    var entity = this.state.get('entity');
    var action = this.state.get('action');

    if ( ! entity
      || ! this._script[ entity.id ]
      || ! this._script[ entity.id ][ action ] ) return;

    var i = 0;
    var act = this._script[ entity.id ][ action ];
    var actor = ( act[ i ].actor === 'entity' ) ? entity : this._player;

    this.state.set('act', act );
    this.state.set('actor', actor );
    this.state.set('actIndex', i );

    this.act( actor, act[ i ] );

  }

  update ( timelapse ) {

    var act = this.state.get('act');

    if ( ! act ) return;

    var actIndex = this.state.get('actIndex');
    var actPhase = act[ actIndex ];

    if ( ! actPhase.duration && actPhase.duration != 0 )
      return;

    var actor = this.state.get('actor');

    if ( actPhase.duration <= 0 ) {
      delete actPhase.duration;
      this.next( act, actor, actPhase, actIndex );
    }
    else {
      actPhase.duration -= timelapse;
    }
  }

  next ( act, actor, actPhase, actIndex ) {

    if ( actPhase.action == 'speak')
      actor[ actPhase.action ]( null );

    actPhase = act[ ++actIndex ];

    if ( ! actPhase ) {
      this.state.set('act', null );
      this.state.set('actor', null );
      this.state.set('actIndex', null );
      this.state.set( this.state.defaults );
      return;
    }

    actor = actPhase.actor === 'entity' ?
      this.state.get('entity') :
      this._player
    ;

    this.state.set('actor', actor );
    this.state.set('actIndex', actIndex );
    this.act( actor, actPhase );

  }

  pause ( duration ) {

    var act = this.state.get('act');

    if ( ! act ) return;

    act[ this.state.get('actIndex') ].duration = duration;

  }

  actOn ( entity ) {

    this.state.set('isActive', true );
    this.state.set('entity', entity );

  }

  act ( actor, actPhase ) {

    if ( ! actPhase.duration && actPhase.action == 'speak' )
      actPhase.duration = Math.min( 1500, actPhase.value.join(' ').length * 120 );

    actor[ actPhase.action ]( actPhase.value );

  }

}

export default Scriptor;