var KeyInput = {};

document.addEventListener('keydown', function ( e ) {
  KeyInput.keyCode = e.keyCode;
});
document.addEventListener('keyup', function ( e ) {
  KeyInput.keyCode = null;
});

export default KeyInput;