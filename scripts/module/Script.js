'use strict';

import _ from 'lodash';

var G;

export class Script {

  constructor ( game, cfg ) {

    G = game;

    this.data = cfg;

  }

  getActions ( sprite ) {

    if ( this.data[ sprite.id ] )
      return Object.keys( this.data[ sprite.id ] );
    return [];
  }

  getScript ( sprite, action, actionId ) {

    var script;

    if ( this.data[ sprite.id ] )
      script = this.data[ sprite.id ]
    else return null;

    if ( script[ action ] )
      script = script[ action ]
    else return null;

    if ( script[ actionId ] )
      script = script[ actionId ].script
    else return null;

    return script;

  }

};
