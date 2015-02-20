import {Game} from 'game/module/Game';
import {Behavior} from 'aurelia-framework';

export class SceneViewer {

  static metadata () {

    return Behavior
      .customElement('scene-viewer')
      .withProperty('model')
      .withProperty('src')
    ;

  }

  static inject() { return [Element]; }

  constructor( element ) {

    this.element = element;

  }

  bind () {

    var sceneConfig = this['scene-config'];
    var viewConfig  = {
      x: 0,
      y: 0,
      width: 400,
      height: 200,
      resolution: 1.95
    };

    this.model.game = new Game( this.element, viewConfig, sceneConfig, true );
    this.model.game.messenger.subscribe('sprite/click', function ( sprite ) {
      this.model.sprite = sprite;
    }.bind(this));

  }

}