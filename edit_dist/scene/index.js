System.register(["../Service/Fetch"], function (_export) {
  "use strict";

  var Fetch, _prototypeProperties, _classCallCheck, EditScene_Index, CapitalizeValueConverter;
  return {
    setters: [function (_ServiceFetch) {
      Fetch = _ServiceFetch.Fetch;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      EditScene_Index = _export("EditScene_Index", (function () {
        function EditScene_Index(Fetch) {
          _classCallCheck(this, EditScene_Index);

          this.M = {
            game: undefined,
            sprite: undefined,
            script: undefined
          };

          this.heading = "Scene";
          this.Fetch = Fetch;
        }

        _prototypeProperties(EditScene_Index, {
          inject: {
            value: function inject() {
              return [Fetch];
            },
            writable: true,
            configurable: true
          }
        }, {
          activate: {
            value: function activate(params, queryString, routeConfig) {
              var _this = this;


              var sceneId = params.sceneId || 0;

              return this.Fetch.resource("/game_data/scene/" + sceneId + "/_config.json").then(function (response) {
                _this.sceneConfig = response;
                response;
              }, function (error) {
                console.error(error);
                error;
              });
            },
            writable: true,
            configurable: true
          },
          selectSprite: {
            value: function selectSprite(sprite) {
              this.M.sprite = sprite;
            },
            writable: true,
            configurable: true
          },
          editSpriteScript: {
            value: function editSpriteScript(id, e) {
              e.preventDefault();
              this.M.script = this.sceneScript[id];
            },
            writable: true,
            configurable: true
          },
          cancelSprite: {
            value: function cancelSprite(e) {
              e.preventDefault();
              this.M.sprite = undefined;
            },
            writable: true,
            configurable: true
          },
          submitSprite: {
            value: function submitSprite(e) {
              e.preventDefault();
            },
            writable: true,
            configurable: true
          },
          submitBackground: {
            value: function submitBackground(e) {
              e.preventDefault();
            },
            writable: true,
            configurable: true
          }
        });

        return EditScene_Index;
      })());
      CapitalizeValueConverter = _export("CapitalizeValueConverter", (function () {
        function CapitalizeValueConverter() {
          _classCallCheck(this, CapitalizeValueConverter);
        }

        _prototypeProperties(CapitalizeValueConverter, null, {
          toView: {
            value: function toView(value) {
              return value && value.charAt(0).toUpperCase() + value.substr(1);
            },
            writable: true,
            configurable: true
          }
        });

        return CapitalizeValueConverter;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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