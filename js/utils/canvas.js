/*
 * CANVAS UTILITIES MODULE
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
 *   processTranspancy( gfxObject, index  )
 * 
 */
define(

  // MODULE NAME
  'utils/canvas',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {
    
    var _P = {
          mask: {
            r: 128,
            g: 128,
            b: 255
          }
        };

    var canvasUtils = {
    
      proccesGfxToCanvas: function ( gfxObject, ctxRatio ) {

        var imageData

        // setup Sprite Canvas
        gfxObject.canvas        = document.createElement( 'canvas' );
        gfxObject.canvas.width  = gfxObject.image.width;
        gfxObject.canvas.height = gfxObject.image.height;

        gfxObject.ctx = gfxObject.canvas.getContext( '2d');
        gfxObject.ctx.drawImage( gfxObject.image, 0, 0, gfxObject.canvas.width, gfxObject.canvas.height );

        imageData = gfxObject.ctx.getImageData( 0, 0, gfxObject.canvas.width, gfxObject.canvas.height );

        // process turqoise pixels to transparent 
        canvasUtils.processTranspancy( imageData );

        // darken image
        if ( gfxObject.darkenBy ) {
          canvasUtils.darkenImage( imageData, gfxObject.darkenBy );
        }
        
        gfxObject.ctx.clearRect( 0, 0, gfxObject.canvas.width, gfxObject.canvas.height );
        gfxObject.ctx.putImageData( imageData, 0, 0 );

        gfxObject.ready = true;
      },

      processTranspancy: function ( imageData, mask ) {

        var mask = mask || _P.mask;

        for ( var index = 0, len = imageData.width * imageData.height * 4; index < len; index += 4 ) {
          if ( imageData.data[ index + 1 ] === mask.r && imageData.data[ index + 2 ] === mask.g && imageData.data[ index + 3 ] === mask.b ) {
            imageData.data[ index ] = 0; imageData.data[ index + 1 ] = 0; imageData.data[ index + 2 ] = 0; imageData.data[ index + 3 ] = 0;
          }
        }
      },

      darkenImage: function( imageData, factor ) {

        if ( factor < 1 ) { // factor is a percentage
          factor = 255 * factor;
        }

        for ( var index = 0, len = imageData.width * imageData.height * 4; index < len; index += 4 ) {
          imageData.data[ index ] -= factor; imageData.data[ index + 1 ] -= factor; imageData.data[ index + 2 ] -= factor;
        }
      },

      stretch: function ( imageData, canvas, ctxRatio ) {
        /*
        var x = 1,
            y = 1,
            ctx = canvas.getContext('2d');

        // process turqoise pixels to transparent 
        for ( var i = 0, len = imageData.width * imageData.height * 4; i < len; i += 4 ) {
          
          x = ( i / 4 ) % imageData.width;
          y = Math.floor( ( i / 4 ) / imageData.width );

          ctx.fillStyle = 'rgba(' + imageData.data[ i ] + ',' + imageData.data[ i +1 ] + ',' + imageData.data[ i +2 ] + ',' + imageData.data[ i +3 ] + ')';
          ctx.fillRect( x * ctxRatio, y * ctxRatio, ctxRatio, ctxRatio );
        }
        */
      }

    };

    return canvasUtils;
  }
);