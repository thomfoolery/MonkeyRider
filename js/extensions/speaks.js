/*
 * SPEECH ACTION
 * =====================
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
 *   setSpeach ()
 *   speak ()
 *   update ()
 *
 */
define(

  // MODULE NAME
  'extension/speaks',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {

    return function ( supertype, properties ) {

      var Speaks = Object.create( supertype )
        , props = {
            "message":  null,
            "duration": 0,
            "lapsed":   0,
            "color":    '#ff00fc'
          }
        ;

      $.extend( props, properties );

      supertype.setProperty({
        "extensions": {
          "speaks": props
        }
      });

      Speaks.setSpeech = function ( message, scriptor ) {

        var speech    = this.getProperty('extensions.speaks')
          , scriptor  = this.getProperty('scriptor')
          ;

        speech.duration = Math.min( Math.max( 1000, ( message.length * 100 ) ), 3000 );
        speech.message  = message;
        speech.lapsed   = 0;
        speech.scriptor = scriptor;
      };

      Speaks.speak = function ( timeLapsed ) {

        var speech = this.getProperty('extensions.speaks')
          , scriptor  = this.getProperty('scriptor')
          ;

        speech.lapsed += timeLapsed;

        if ( speech.lapsed > speech.duration ) {
          speech.lapsed = 0;
          speech.message = null;
          scriptor.next();
        }
      };

      Speaks.update = function ( timeLapsed ) {

        supertype.update.call( this, timeLapsed );

        var message = this.getProperty('extensions.speaks.message');

        if ( typeof message === 'string') {
          this.speak( timeLapsed );
        }
      };

      Speaks.draw = function ( timeLapsed ) {

        var speech  = this.getProperty('extensions.speaks')
          , CTX     = this.CTX
          ;

        supertype.draw.call( this, timeLapsed );

        // talk
        if ( typeof speech.message === 'string' ){

          var fontSize = Math.round( 5 * CTX.ratio )
            , lines = speech.message.split('//')
            , line
            ;

          for ( var i = 0, len = lines.length; i < len; i++ ) {

            line = lines[ i ];

            CTX.font = 'bold ' + fontSize + 'px monospace';
            CTX.fillStyle = speech.color;
            CTX.fillText( line, this.x + this.width, this.y - this.height + ( fontSize * i ) + 2 );
          }
        }
      }

      return Speaks;
    }
  }
);
