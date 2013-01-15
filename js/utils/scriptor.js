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

     function Scriptor ( actors, scriptURL ) {

      var self = this;

      this.actors = actors;

      for ( var i = 0, len = actors.length; i < len; i ++ ) {
        actors[ i ].setProperty({"scriptor": this });
      }

      this.loadScript( scriptURL, function () { self.next() });
    }

    Scriptor.prototype = {

      "getActor": function ( id ) {

        return _.where( this.actors, {"id": id });
      },

      "loadScript": function ( scriptURL, callback ) {

        var self = this;

        $.get('data/script/' + scriptURL, function ( script ) {

          self.script = script;
          if ( typeof callback === 'function' ) callback();
        });
      },

      "next": function () {

        if ( this.script.length < 1 ) {
          _.where( this.actors, { "id": 'player' })[0].resetSelection();
          return; // EXIT
        }

        var obj = this.script.shift()
          , actor = _.where( this.actors, {"id": obj.actor })[0]
          , action = obj.action
          , value = obj.value
          , self = this
          ;

        //console.log( actor, action, value );

        if ( actor )
          actor[ action ]( value, this );

        else {
          if ( action === 'pause' )
            setTimeout( function() { self.next() }, value );
        }
      },

      "isComplete": function () {

        if ( this.script.length === 0 ) return true;
        return false;
      }
    };

    return Scriptor;
  }
);
