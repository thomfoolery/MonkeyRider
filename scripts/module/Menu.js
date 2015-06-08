var G;

export class Menu {

  constructor ( game, cfg ) {

    G = game;

    this.width   = G.viewport.width;
    this.height  = cfg.height || 50;

    this.bgColor = cfg.bgColor || 0x111111;

    this.view            = new PIXI.Container();
    this.view.position.y = G.viewport.height - this.height;

    this.bg = new PIXI.Graphics();
    this.bg.beginFill( this.bgColor );
    this.bg.drawRect( 0, 0, this.width, this.height );
    this.bg.endFill();

    this.actionText            = new PIXI.Container();
    this.actionText.position.x = this.width/2;
    this.actionText.position.y = 5;

    this.view.addChild( this.bg );
    this.view.addChild( this.actionText );

    G.stage.addChild( this.view );

  }

  setActionText ( text ) {

    var textStyle = {
        font: '20px monospace',
        fill: 'green',
    };

    var textSprite      = new PIXI.Text( text, textStyle );
    textSprite.anchor.x = 0.5;

    this.actionText.removeChildren();
    this.actionText.addChild( textSprite );

  }

  destroy () {

  }

}