'use strict';

var G;

export class Editor {

  constructor ( game ) {

    G = game;

    this. $ = {};

    this.$.form = document.createElement('form');
    document.body.appendChild( this.$.form );
    this.$.form.id = 'game-editor';

    this.$.title = document.createElement('div');
    this.$.title.classList.add('editor-title');
    this.$.form.appendChild( this.$.title );

    this.$.fields = [
      'field-x',
      'field-y',
      'field-dir',
      'field-tint',
      'field-width',
      'field-height',
      'field-scaleX',
      'field-scaleY',
      'field-anchorX',
      'field-anchorY'
    ];

    this.$.fields.forEach( function ( value, index ) {

      var label = document.createElement('label');
      var field = document.createElement('input');

      label.setAttribute('for', field.id = field.name = value );
      label.innerText = value.split('-').pop();

      field.type = 'number';
      field.onchange = this.onChange.bind( this );

      this.$.fields[ index ] = field;
      this.$.form.appendChild( label );
      this.$.form.appendChild( field );
    }, this );

    document.addEventListener('keydown', function ( e ) {
      if ( e.keyCode == 69 /* e */ ) {
        if ( location.hash == '#edit' ) {
          location.hash = '';
          this.close();
        }
        else
          location.hash = '#edit';
      }
    }.bind( this ));

    this.$.form.addEventListener('submit', this.onSubmit.bind(this) );

    G.DOMcontainer.addEventListener('click',      click.bind(this) );
    G.DOMcontainer.addEventListener('touchstart', click.bind(this) );

    function click ( e ) {

      if ( ! G.editor.isEditing ) return; // exit

      var x = ( e.clientX || e.touches[0].clientX );
      var y = ( e.clientY || e.touches[0].clientY );

      var sprite = G.scene.findSpriteByPoint( x, y );

      if ( sprite )
        this.open( sprite );
      else
        this.hide( sprite );
    }

  }

  hide () {
    this.$.form.style.display = 'none';
  }

  show () {
    this.$.form.style.display = 'block';
  }

  toggle () {
    if ( this.$.form.style.display == 'none' )
      this.$.form.style.display = 'block';
    else
      this.$.form.style.display = 'none';
  }

  open ( sprite ) {

    this.sprite = sprite;

    this.$.title.innerText = this.sprite.id;

    this.$.fields.forEach( function ( field, index ) {
      field.value = sprite[ field.id.split('-').pop() ];
    });

    this.show();
  }

  get isEditing () {
    return ( location.hash == '#edit' );
  }

  close () {

    this.hide();
    // var path = '/data/scene/' + G.scene.index + '/';
    // saveFile( path + 'congfig.json', JSON.stringify( G.scene.cfg ) );
    delete this.sprite;
  }

  onChange ( e ) {
    e.preventDefault();

    if ( ! this.sprite ) return; // exit

    var prop = e.target.id.split('-').pop();
    this.sprite[ prop ] = e.target.value;
  }

  onSubmit () {
    e.preventDefault();

    this.close();
  }

}

function saveFile ( filename, content ) {
  // TODO
}