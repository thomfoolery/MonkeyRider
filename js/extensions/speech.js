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
  'extension/speech',

  // DEPENDANCIES
  [
    'utils/inheritance',
    'utils/decorator'
  ],

  // CALLBACK
  function ( OBJECT, Decorator ) {

    function Speech ( object ) {
      this.superclass.constructor( object );
    }

    OBJECT.extend( Speech, Decorator );

    Speech.prototype.setSpeech = function ( message, scriptor ) {

      var speech    = this.getProperty('action.speech')
        , scriptor  = this.getProperty('scriptor')
        ;

      speech.duration = Math.max( 1000, ( speech.length * 150 ) ),
      speech.message  = speech;
      speech.lapsed   = 0;
      scriptor        = scriptor;
    };

    Speech.prototype.speak = function ( timeLapsed ) {

      var speech = this.getProperty('action.speech')
        , scriptor  = this.getProperty('scriptor')
        ;

      speech.lapsed += timeLapsed;

      if ( speech.lapsed > speech.duration ) {
        speech.lapsed = 0;
        speech.speech = null;
        scriptor.next();
      }
    };

    Speech.prototype.update = function ( timeLapsed ) {

      this.superclass.update( timeLapsed );

      var message = this.getProperty('action.speech.message');

      if ( typeof message === 'string') {
        this.speak( timeLapsed );
      }
    };

    Speech.prototype.objectdraw = function ( timeLapsed ) {

      var speech  = this.getProperty('action.speech')
        , CTX     = this.getProperty('CTX')
        ;

      this.superclass.draw( timeLapsed );

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
          CTX.fillText( line, _P.x + this.width, this.y - this.height + ( fontSize * i ) + 2 );
        }
      }
    };

    return Speech;
  }
);
