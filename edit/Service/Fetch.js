import {HttpClient} from 'aurelia-http-client';

var http = new HttpClient();
var cache = {};

function fetchResource ( URL ) {

  return http.get( URL ).then(

    function resolve ( response ) {

      cache[ URL ] = response.content;
      return cache[ URL ];

    }.bind( this ),

    function reject ( error ) {

      console.error( error );
      return error;

    }.bind( this )

  );

}

export class Fetch {

  resource ( URL ) {

    if ( cache[ URL ] ) {
      return new Promise( function ( resolve ) {
        resolve ( cache[ URL ] );
      });
    }

    return fetchResource( URL );

  }



};