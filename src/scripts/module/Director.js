'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import Game from 'game/module/Game';

var index;
var phase;
var script;
var actions;
var timeElapsed;
var isPaused = false;

var Director = {

  start ( cfg ) {

    if ( ! cfg ) return;

    index       = 0;
    script      = cfg;
    actions     = script.actions;
    timeElapsed = 0;

    actions.forEach( function ( phase ) {
      phase.complete = false;
    });

    this.act();

  },

  act () {

    phase = actions[ index ];

    var actor = Game.scene.sprites[ phase.actor ];

    if ( ! phase.duration && phase.action == 'speak' )
      phase.duration = Math.max( 1000, Math.min( 3000, phase.value.length * 120 ) );

    var [ action, prop ] = phase.action.split(':');

    if ( prop )
      actor[ action ]( prop, phase.value );
    else
      actor[ action ]( phase.value );

  },

  pause   () { isPaused = true;  },

  unpause () { isPaused = false; },

  update ( timelapse ) {

    if ( Game.player ) {
      Game.player.update( timelapse );
    }

    if ( ! actions || phase.complete || isPaused ) return; // exit

    var actor = Game.scene.sprites[ phase.actor ];

    // phase complete
    if ( ! phase.duration || phase.duration - timeElapsed <= 0 ) {

      timeElapsed = 0;
      phase.complete = true;

      if ( phase.action == 'speak')
        actor.clearSpeech();

      // act complete
      if ( ! actions[ ++index ] ) {
        this.complete();
      }
      // next act
      else {
        index = index;
        this.act();
      }

      return; // exit
    }

    timeElapsed += timelapse;

  },

  complete () {

    if ( phase.action === 'speak' ) {
      Game.scene.sprites[ phase.actor ].clearSpeech();
    }

    if ( ! script.meta.repeat ) {
      Game.script.removeScript( script.meta.target, script.meta.action, script.meta.id );
    }

    script.meta.actors.forEach( ( actorId ) => {

      var actor = Game.scene.sprites[ actorId ];
      actor.clearSpeech && actor.clearSpeech();
      actor.state = 'default';

    });

    index       = null;
    phase       = null;
    script      = null;
    actions     = null;
    timeElapsed = null;
    isPaused    = false;

  },

  get isActing () {
    return !! actions;
  },

  get isPaused () {
    return isPaused;
  }

};

export default Director;