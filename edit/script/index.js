import {Fetch} from '../Service/Fetch';


class SriptLine {

  constructor ( line ) {

    this.actor    = line.actor;
    this.action   = line.action;
    this.value    = line.value;
    this.duration = line.duration;

  }

  get actor () { return this.actor; }
  set actor ( actor ) { this.actor = actor; }

  get action () { return this.action; }
  set action ( action ) { this.action = action; }

  get value () { return this.value; }
  set value ( value ) { this.value = value; }

  get duration () { return this.duration; }
  set duration ( duration ) { this.duration = duration; }

}

export class EditScript_Index {

  static inject() { return [Fetch]; }

  constructor( Fetch ){

    this.M = {

      script: undefined,

      actions: ['look at','talk to','pick up','close','open','give','use'],
      selectedAction: 'look at',

      act: undefined,
      sprites: [],
      states: undefined,
      editedLine: undefined

    };

    this.heading = 'Script';
    this.Fetch   = Fetch;

  }

  activate ( params, queryString, routeConfig ) {

    var sceneID   = params.sceneID || 0;
    this.spriteID = params.spriteID;

    var fetchScene = this.Fetch
      .resource('/game_data/scene/' + sceneID + '/_config.json')
      .then(
        response => {
          this.M.sprites = this.M.sprites.concat( response.gameObjects.sprites );
          response;
        },
        error => {
          console.error( error );
          error;
        }
      )
    ;

    var fetchPlayer = this.Fetch
      .resource('/game_data/player.json')
      .then(
        response => {
          this.M.sprites.push( response );
          response;
        },
        error => {
          console.error( error );
          error;
        }
      )
    ;

    var fetchScript = this.Fetch
      .resource('/game_data/scene/' + sceneID + '/_script.json')
      .then(
        response => {

          this.M.script = response[ this.spriteID ];

          var self = this;
          this.M.actions.forEach( action => {
            if ( ! self.M.script[ action ] )
              self.M.script[ action ] = [];
          });

          response;

        },
        error => {
          console.error( error );
          error;
        }
      )
    ;

    return Promise.all( fetchScene, fetchPlayer, fetchScript );

  }

  selectAction ( action ) {

    this.M.selectedAction = action;
    this.M.editedLine = undefined;
    this.M.states = undefined;
    this.M.act = undefined;

    if ( ! this.M.script[ action ] )
      this.M.script[ action ] = [];
  }

  addAct( script ) {

    script.push([]);

  }

  editAct( act ) {

    this.M.act = act;

  }

  removeAct( script, index ) {

    script.splice( index, 1 );

  }

  addLine ( index ) {

    this.M.editedLine = {
      actor:    'player',
      action:   'speak',
      value:    [],
      duration: undefined
    };

    this.M.act.splice( index, 0, this.M.editedLine );

  }

  editLine ( index ) {

    this.M.editedLine = this.M.act[ index ];

    var spriteID = ( this.M.editedLine.actor === 'sprite' ) ?
      this.spriteID :
      this.M.editedLine.actor
    ;

    this.M.sprites.forEach( sprite => {
      if ( sprite.id == spriteID )
        this.M.states = Object.keys( sprite.states );
    });

  }

  saveLine ( line ) {

    this.M.editedLine = undefined;
    this.M.states = undefined;

  }

  removeLine ( index ) {

    this.M.act.splice( index, 1 );

  }

}

export class CapitalizeValueConverter {
  toView( value ){
    return value && value.charAt(0).toUpperCase() + value.substr(1);
  }
}