'use strict';

import Utils from 'app/Utils';
import Backbone from 'backbone';

var DEFAULT_ACTION =  'look at';

var StateModel = Backbone.Model.extend({
  defaults: {
    action:   DEFAULT_ACTION,
    entityID: null,
    isActive: false
  }
});

class Controls {

  constructor ( game, $actionPanel, $actionDescriptor, $inventoryPanel ) {

    this.game              = game;
    this.$actionPanel      = $actionPanel;
    this.$inventoryPanel   = $inventoryPanel;
    this.$actionDescriptor = $actionDescriptor;

    this.$actionPanel.addEventListener('click', this.onClickActionPanel.bind( this ));

    this.inventory = new Backbone.Collection();
    this.inventory.on('add remove', this.onChangeInventory, this );

    this._state = new StateModel();
    this._state.on('change:isActive',               this.onIsActiveChange, this );
    this._state.on('change:action change:entityID', this.updateDescriptor, this );

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

    var action   = stateModel.get('action');
    var entityID = stateModel.get('entityID');

    var text = Utils.capitalize( action );

    if ( entityID )
      text += ' ' + Utils.capitalize( entityID );

    this.$actionDescriptor.innerHTML = text;

  }

}

export default Controls;