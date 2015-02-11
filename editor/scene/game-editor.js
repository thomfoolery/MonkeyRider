import {Game} from '../../game/module/Game';
import {Behavior} from 'aurelia-framework';

export class GameEditor {

  static metadata () {

    return Behavior
      .customElement('game-editor')
      .withProperty('scene-config');

  }

  static inject() { return [Element]; }

  constructor( element ) {

    this.element = element;

  }

  bind () {

    var viewConfig = {
      x: 0,
      y: 0,
      width: 400,
      height: 200,
      resolution: 2
    };

    var sceneConfig = this['scene-config'];

    this.game = new Game( this.element, viewConfig, sceneConfig, true );

    this.game.ready.then( game => {

      game.messenger.subscribe('entity/click', entity => {
        console.dir( entity.toJSON() );
      });

      console.log( game.scene.toJSON() );

    });

  }

}