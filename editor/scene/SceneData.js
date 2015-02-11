import {HttpClient} from 'aurelia-http-client';

var http = new HttpClient();
var cache = {};

export class SceneData {

  get ( sceneIndex, categoryID, itemID ) {

    if ( cache[ sceneIndex ] ) {

      let p = new Promise( function ( resolve ) {

        var value = categoryID ?
          cache[ sceneIndex ].gameObjects[ categoryID ] :
          cache[ sceneIndex ]
        ;

        if ( itemID ) {
          value = this.findItem( value, itemID );
        }

        resolve ( value );
      }.bind( this ));

      return p;
    }

    return this.fetch( sceneIndex );

  }

  fetch ( sceneIndex, categoryID, itemID ) {

    return http.get('/game_data/scene/' + sceneIndex + '/_config.json').then(

      function resolve ( response ) {

        cache[ sceneIndex ] = response.content;

        var value = categoryID ?
          cache[ sceneIndex ].gameObjects[ categoryID ] :
          cache[ sceneIndex ]
        ;

        if ( itemID ) {
          value = this.findItem( value, itemID );
        }

        return value;

      }.bind( this ),

      function reject ( error ) {

        console.error( error );
        return error;

      }.bind( this )

    );

  }

  findItem( items, itemID ) {

    var value = null;

    items.forEach( item => {
      if ( item.id === itemID )
        value = item;
    });

    return value;

  }

};