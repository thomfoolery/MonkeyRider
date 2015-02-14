import {SceneData} from './SceneData';

export class EditScene_Index {

  static inject() { return [SceneData]; }

  constructor( SceneData ){

    this.M = {
      game:   null,
      entity: null
    };

    this.heading   = 'Scene';
    this.SceneData = SceneData;

  }

  activate ( params, queryString, routeConfig ) {

    this.sceneIndex = params.id || 0;

    return this.SceneData
      .get( this.sceneIndex )
      .then(
        resolved.bind( this ),
        rejected.bind( this )
      )
    ;

    function resolved ( response ) {
      this.sceneConfig = response;
      if ( ! this.categories )
        this.categories = Object.keys( this.sceneConfig.gameObjects );
      return response;
    };

    function rejected ( error ) {
      console.error( error );
      return error;
    };

  }

  submitEntity ( e ) {

    e.preventDefault();

  }

}

export class CapitalizeValueConverter {
  toView( value ){
    return value && value.charAt(0).toUpperCase() + value.substr(1);
  }
}