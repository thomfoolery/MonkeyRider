import Utils from 'app/Utils';
import Backbone from 'backbone';

class Controls {

  constructor ( stageManager, $actionPanel, $actionDescriptor, $inventoryPanel ) {

    var DEFAULT_ACTION =  'look at';

    this.stageManager      = stageManager;
    this.$actionPanel      = $actionPanel;
    this.$inventoryPanel   = $inventoryPanel;
    this.$actionDescriptor = $actionDescriptor;

    this.$actionPanel.addEventListener('click', this.onClickActionPanel.bind( this ));

    // State
    var StateModel = Backbone.Model.extend({
      defaults: {
        action:   DEFAULT_ACTION,
        entityID: null,
        isActive: false
      }
    });

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