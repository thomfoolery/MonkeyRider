System.register(["game/module/Game", "aurelia-framework"], function (_export) {
  "use strict";

  var Game, Behavior, _prototypeProperties, _classCallCheck, SceneViewer;
  return {
    setters: [function (_gameModuleGame) {
      Game = _gameModuleGame.Game;
    }, function (_aureliaFramework) {
      Behavior = _aureliaFramework.Behavior;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      SceneViewer = _export("SceneViewer", (function () {
        function SceneViewer(element) {
          _classCallCheck(this, SceneViewer);

          this.element = element;
        }

        _prototypeProperties(SceneViewer, {
          metadata: {
            value: function metadata() {
              return Behavior.customElement("scene-viewer").withProperty("model").withProperty("src");
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [Element];
            },
            writable: true,
            configurable: true
          }
        }, {
          bind: {
            value: function bind() {
              var sceneConfig = this["scene-config"];
              var viewConfig = {
                x: 0,
                y: 0,
                width: 400,
                height: 200,
                resolution: 1.95
              };

              this.model.game = new Game(this.element, viewConfig, sceneConfig, true);
              this.model.game.messenger.subscribe("sprite/click", (function (sprite) {
                this.model.sprite = sprite;
              }).bind(this));
            },
            writable: true,
            configurable: true
          }
        });

        return SceneViewer;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjZW5lL3NjZW5lLXZpZXdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7TUFBUSxJQUFJLEVBQ0osUUFBUSx5Q0FFSCxXQUFXOzs7QUFIaEIsVUFBSSxtQkFBSixJQUFJOztBQUNKLGNBQVEscUJBQVIsUUFBUTs7Ozs7OztBQUVILGlCQUFXO0FBY1gsaUJBZEEsV0FBVyxDQWNULE9BQU87Z0NBZFQsV0FBVzs7QUFnQnBCLGNBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBRXhCOzs2QkFsQlUsV0FBVztBQUVmLGtCQUFRO21CQUFDLG9CQUFHO0FBRWpCLHFCQUFPLFFBQVEsQ0FDWixhQUFhLENBQUMsY0FBYyxDQUFDLENBQzdCLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FDckIsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUNyQjthQUVGOzs7O0FBRU0sZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQUU7Ozs7O0FBUXJDLGNBQUk7bUJBQUMsZ0JBQUc7QUFFTixrQkFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZDLGtCQUFJLFVBQVUsR0FBSTtBQUNoQixpQkFBQyxFQUFFLENBQUM7QUFDSixpQkFBQyxFQUFFLENBQUM7QUFDSixxQkFBSyxFQUFFLEdBQUc7QUFDVixzQkFBTSxFQUFFLEdBQUc7QUFDWCwwQkFBVSxFQUFFLElBQUk7ZUFDakIsQ0FBQzs7QUFFRixrQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBRSxDQUFDO0FBQzFFLGtCQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFBLFVBQVcsTUFBTSxFQUFHO0FBQ3RFLG9CQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7ZUFDNUIsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBRWY7Ozs7OztlQXBDVSxXQUFXIiwiZmlsZSI6InNjZW5lL3NjZW5lLXZpZXdlci5qcyIsInNvdXJjZVJvb3QiOiIvZWRpdC8ifQ==