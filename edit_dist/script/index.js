System.register(["../Service/Fetch"], function (_export) {
  "use strict";

  var Fetch, _prototypeProperties, _classCallCheck, SriptLine, EditScript_Index, CapitalizeValueConverter;
  return {
    setters: [function (_ServiceFetch) {
      Fetch = _ServiceFetch.Fetch;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      SriptLine = (function () {
        function SriptLine(line) {
          _classCallCheck(this, SriptLine);

          this.actor = line.actor;
          this.action = line.action;
          this.value = line.value;
          this.duration = line.duration;
        }

        _prototypeProperties(SriptLine, null, {
          actor: {
            get: function () {
              return this.actor;
            },
            set: function (actor) {
              this.actor = actor;
            },
            configurable: true
          },
          action: {
            get: function () {
              return this.action;
            },
            set: function (action) {
              this.action = action;
            },
            configurable: true
          },
          value: {
            get: function () {
              return this.value;
            },
            set: function (value) {
              this.value = value;
            },
            configurable: true
          },
          duration: {
            get: function () {
              return this.duration;
            },
            set: function (duration) {
              this.duration = duration;
            },
            configurable: true
          }
        });

        return SriptLine;
      })();
      EditScript_Index = _export("EditScript_Index", (function () {
        function EditScript_Index(Fetch) {
          _classCallCheck(this, EditScript_Index);

          this.M = {

            script: undefined,

            actions: ["look at", "talk to", "pick up", "close", "open", "give", "use"],
            selectedAction: "look at",

            act: undefined,
            sprites: [],
            states: undefined,
            editedLine: undefined

          };

          this.heading = "Script";
          this.Fetch = Fetch;
        }

        _prototypeProperties(EditScript_Index, {
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


              var sceneID = params.sceneID || 0;
              this.spriteID = params.spriteID;

              var fetchScene = this.Fetch.resource("/game_data/scene/" + sceneID + "/_config.json").then(function (response) {
                _this.M.sprites = _this.M.sprites.concat(response.gameObjects.sprites);
                response;
              }, function (error) {
                console.error(error);
                error;
              });

              var fetchPlayer = this.Fetch.resource("/game_data/player.json").then(function (response) {
                _this.M.sprites.push(response);
                response;
              }, function (error) {
                console.error(error);
                error;
              });

              var fetchScript = this.Fetch.resource("/game_data/scene/" + sceneID + "/_script.json").then(function (response) {
                _this.M.script = response[_this.spriteID];

                var self = _this;
                _this.M.actions.forEach(function (action) {
                  if (!self.M.script[action]) self.M.script[action] = [];
                });

                response;
              }, function (error) {
                console.error(error);
                error;
              });

              return Promise.all(fetchScene, fetchPlayer, fetchScript);
            },
            writable: true,
            configurable: true
          },
          selectAction: {
            value: function selectAction(action) {
              this.M.selectedAction = action;
              this.M.editedLine = undefined;
              this.M.states = undefined;
              this.M.act = undefined;

              if (!this.M.script[action]) this.M.script[action] = [];
            },
            writable: true,
            configurable: true
          },
          addAct: {
            value: function addAct(script) {
              script.push([]);
            },
            writable: true,
            configurable: true
          },
          editAct: {
            value: function editAct(act) {
              this.M.act = act;
            },
            writable: true,
            configurable: true
          },
          removeAct: {
            value: function removeAct(script, index) {
              script.splice(index, 1);
            },
            writable: true,
            configurable: true
          },
          addLine: {
            value: function addLine(index) {
              this.M.editedLine = {
                actor: "player",
                action: "speak",
                value: [],
                duration: undefined
              };

              this.M.act.splice(index, 0, this.M.editedLine);
            },
            writable: true,
            configurable: true
          },
          editLine: {
            value: function editLine(index) {
              var _this = this;


              this.M.editedLine = this.M.act[index];

              var spriteID = this.M.editedLine.actor === "sprite" ? this.spriteID : this.M.editedLine.actor;

              this.M.sprites.forEach(function (sprite) {
                if (sprite.id == spriteID) _this.M.states = Object.keys(sprite.states);
              });
            },
            writable: true,
            configurable: true
          },
          saveLine: {
            value: function saveLine(line) {
              this.M.editedLine = undefined;
              this.M.states = undefined;
            },
            writable: true,
            configurable: true
          },
          removeLine: {
            value: function removeLine(index) {
              this.M.act.splice(index, 1);
            },
            writable: true,
            configurable: true
          }
        });

        return EditScript_Index;
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