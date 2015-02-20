import {Fetch} from '../Service/Fetch';

export class EditScene_Index {

  static inject() { return [Fetch]; }

  constructor( Fetch ){

    this.M = {
      game:   undefined,
      sprite: undefined,
      script: undefined
    };

    this.heading = 'Scene';
    this.Fetch   = Fetch;

  }

  activate ( params, queryString, routeConfig ) {

    var sceneId = params.sceneId || 0;

    return this.Fetch
      .resource('/game_data/scene/' + sceneId + '/_config.json')
      .then(
        response => {
          this.sceneConfig = response;
          response;
        },
        error => {
          console.error( error );
          error;
        }
      )
    ;

  }

  selectSprite ( sprite ) {

    this.M.sprite = sprite;

  }

  editSpriteScript ( id, e ) {

    e.preventDefault();
    this.M.script = this.sceneScript[ id ];

  }

  cancelSprite (  e ) {

    e.preventDefault();
    this.M.sprite = undefined;

  }

  submitSprite ( e ) {

    e.preventDefault();

  }

  submitBackground ( e ) {

    e.preventDefault();

  }

}

export class CapitalizeValueConverter {
  toView( value ){
    return value && value.charAt(0).toUpperCase() + value.substr(1);
  }
}