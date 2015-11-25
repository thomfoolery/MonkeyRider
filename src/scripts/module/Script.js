'use strict';

import _ from 'lodash';
import Game from 'game/module/Game';

export default class Script {

  constructor ( cfg ) {

    this.data = cfg;

  }

  getActions ( target ) {

    if ( this.data[ target.id ] )
      return Object.keys( this.data[ target.id ] );
    return [];

  }

  getScript ( target, action, actionId ) {

    var script;

    if ( this.data[ target.id ] )
      script = this.data[ target.id ];
    else return null;

    if ( script[ action ] )
      script = script[ action ];
    else return null;

    if ( script[ actionId ] )
      script = script[ actionId ];
    else return null;

    script.meta.id     = actionId;
    script.meta.action = action;
    script.meta.target = target;

    return script;

  }

  removeScript ( target, action, actionId ) {

    if ( ! this.data[ target.id ] )
      return false;

    if ( ! this.data[ target.id ][ action ] )
      return false;

    if ( ! this.data[ target.id ][ action ][ actionId ] )
      return false;

    delete this.data[ target.id ][ action ][ actionId ];

  }

};
