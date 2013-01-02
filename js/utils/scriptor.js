"use strict";
/*
 * SCRIPT UTILITIES MODULE
 * =======================
 *
 * PUBLIC PROPERTIES --- (!) IMMUTABLE
 *------------------
 *
 *   N/A
 *
 * PUBLIC SETTERS
 *---------------
 *
 *   N/A
 *
 * PUBLIC METHODS
 *---------------
 *
 *   degToRad ( degrees )         : INT
 *
 *   radToDeg ( radians )         : INT
 *
 *   angle ( x1, y1, x2, y2 )     : INT
 *
 *   distance ( x1, y1, x2, y2 )  : INT
 *
 */
define(

  // MODULE NAME
  'utils/scriptor',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {

     function Scriptor ( actors, script, SCENE ) {

        var _P = {
            player: _.where( actors, {"name": 'player' })[0],
            actors: actors,
            script: script,
            isComplete: false
          }

        , self = this
        ;

      this.next = function () {

        if ( _P.script.length < 1 ) {
          _P.player.resetSelection();
          return; // EXIT
        }

        var obj = _P.script.shift()
          , actor = _.where( _P.actors, {"name": obj.actor })[0]
          , action = obj.action
          , value = obj.value
          ;

          //console.log( actor, action, value );

          if ( actor )
            actor[ action ]( value, self );

          else {
            if ( action === 'pause' )
              setTimeout( self.next, value );
          }
      };

      this.isComplete = function () {

        if ( _P.script.length === 0 ) return true;
        return false;
      };
    }

    return Scriptor;
  }
);
