'use strict';

import Utils from 'game/module/Utils';
import Backbone from 'backbone';

var DEFAULT_ACTION =  'look at';

var StateModel = Backbone.Model.extend({
  defaults: {
    action:   DEFAULT_ACTION,
    entity:   null,
    isActive: false
  }
});

export class Controls {

  constructor ( game, $actionPanel, $actionDescriptor, $inventoryPanel ) {

    this.game              = game;
    this.$actionPanel      = $actionPanel;
    this.$inventoryPanel   = $inventoryPanel;
    this.$actionDescriptor = $actionDescriptor;

    this.$actionPanel.addEventListener('click', this.onClickActionPanel.bind( this ));

    this.inventory = new Backbone.Collection();
    this.inventory.on('add remove', this.onChangeInventory, this );

    this._state = new StateModel();
    this._state.on('change:isActive',             this.onIsActiveChange, this );
    this._state.on('change:action change:entity', this.updateDescriptor, this );

    // mouseover
    this.game.messenger.subscribe('entity/mouseover', entity => {
      if ( this._state.get('isActive') ) return;
      this._state.set('entity', entity );
    });
    // mouseout
    this.game.messenger.subscribe('entity/mouseout', entity => {
      if ( this._state.get('isActive') ) return;
      this._state.set('entity', entity );
    });
    // click
    this.game.messenger.subscribe('entity/click', entity => {
      if ( this._state.get('act') ) return;
      this._state.set('entity', entity );
      this._state.set('isActive', true );
    });

    // init
    this.updateDescriptor( this._state );

  }

  onClickActionPanel ( e ) {

    if ( e.target.tagName != 'A' ) return;
    this._state.set('action', e.target.innerHTML );

  }

  onIsActiveChange ( stateModel ) {

    if ( stateModel.get('isActive') )
      this.$actionDescriptor.classList.add('active');
    else
      this.$actionDescriptor.classList.remove('active');

  }

  onChangeInventory ( inventory ) {

    var ul = document.createElement('a');
    this.inventory.each( function ( item ) {
      var a   = document.createElement('a');
      var li  = document.createElement('li');
      var img = document.createElement('img');

      ul.appendChild( li.appendChild( a.appendChild( img ) ) );
      img.src = item.get('imageURL');


    }.bind( this ));

    ul.id = 'inventory-panel';
    this.$inventoryPanel.parentNode.replaceChild ( ul, this.$inventoryPanel );

  }

  updateDescriptor ( stateModel ) {

    var action = stateModel.get('action');
    var entity = stateModel.get('entity');

    var text = Utils.capitalize( action );

    if ( entity )
      text += ' ' + Utils.capitalize( entity.id );

    this.$actionDescriptor.innerHTML = text;

  }

}

Controls;