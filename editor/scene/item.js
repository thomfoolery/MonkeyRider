import {SceneData} from './SceneData';

export class EditScene_Details_Category_Item {

  static inject() { return [SceneData]; }

  constructor ( SceneData ) {

    this.SceneData = SceneData;

  }

  activate ( params, queryString, routeConfig ) {

    this.itemData = [];
    this.itemKeys = [];

    if ( ! params.id ) {
      this.title = params.id = '';
      return;
    }

    this.title = params.id.charAt(0).toUpperCase() + params.id.substr(1);

    return this.SceneData.get( 0, params.$parent.id, params.id ).then(

      function resolve ( response ) {

        this.itemData = response;
        this.itemKeys = Object.keys( response );
        return response;

      }.bind( this ),

      function reject ( error ) {

        console.error( error );
        return error;

      }.bind( this )

    );

  }

  onSubmit ( event ) {

    event.preventDefault();

  }

}