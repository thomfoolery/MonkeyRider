import {Router} from 'aurelia-router';
import {SceneData} from './SceneData';

export class EditScene_Details_Category {

  static inject() { return [Router,SceneData]; }

  constructor ( router, SceneData ) {

    this.SceneData = SceneData;

    this.router = router;
    router.configure(config => {
      config.map([
        {
          route: ['',':id'],
          moduleId: './item'
        }
      ]);
    });

  }

  activate ( params, queryString, routeConfig ) {

    this.categoryData = [];

    if ( ! params.id ) {
      this.title = params.id = '';
      return;
    }

    this.title = params.id.charAt(0).toUpperCase() + params.id.substr(1);

    return this.SceneData.get( 0, params.id ).then(

      function resolve ( response ) {

        this.categoryData = response;
        return response;

      }.bind( this ),

      function reject ( error ) {

        console.error( error );
        return error;

      }.bind( this )

    );

  }

}