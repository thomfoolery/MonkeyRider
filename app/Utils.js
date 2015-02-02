'use strict';

export default {

  processTransparency: function ( url ) {

    var img = new Image ();
    var buf = new PIXI.CanvasBuffer();
    var ctx = buf.canvas.getContext('2d');

    var mask = {
      r: 128,
      g: 128,
      b: 255
    };

    img.onload = function () {

      buf.canvas.width = img.width;
      buf.canvas.height = img.height;
      ctx.drawImage( img, 0, 0, img.width, img.height );

      var imageData = ctx.getImageData( 0, 0, img.width, img.height );
      for ( var index = 0, len = imageData.width * imageData.height * 4; index < len; index += 4 ) {
        if ( imageData.data[ index + 1 ] === mask.r && imageData.data[ index + 2 ] === mask.g && imageData.data[ index + 3 ] === mask.b ) {
          imageData.data[ index ] = 0; imageData.data[ index + 1 ] = 0; imageData.data[ index + 2 ] = 0; imageData.data[ index + 3 ] = 0;
        }
      }
      ctx.putImageData( imageData, 0, 0 );

      window.open(
        buf.canvas.toDataURL(),
        'toDataURL() image',
        'width=' + img.width + ' , height=' + img.height
      );
    }
    img.src = url;
  }

};