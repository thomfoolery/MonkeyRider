import {Router} from 'aurelia-router';
import {SceneData} from './SceneData';

export class EditScene_Details {

  static inject() { return [Router,SceneData]; }

  constructor( router, SceneData ){

    this.heading = 'Scene';

    this.SceneData = SceneData;

    this.router = router;
    router.configure(config => {
      config.map([
        {
          route: ['',':id'],
          moduleId: './category'
        }
      ]);
    });

  }

  activate ( params, queryString, routeConfig ) {

    this.sceneIndex = params.id;

    return this.SceneData.get( this.sceneIndex ).then(

      function resolve ( response ) {

        this.sceneConfig = response;

        if ( ! this.categories )
          this.categories = Object.keys( this.sceneConfig.gameObjects );

        return response;

      }.bind( this ),

      function reject ( error ) {

        console.error( error );
        return error;

      }.bind( this )

    );

  }

}

export class CapitalizeValueConverter {
  toView( value ){
    return value && value.charAt(0).toUpperCase() + value.substr(1);
  }
}