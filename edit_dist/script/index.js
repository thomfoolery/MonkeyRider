System.register(["../Service/Fetch"], function (_export) {
  "use strict";

  var Fetch, _prototypeProperties, _classCallCheck, ScriptLine, EditScript_Index, CapitalizeValueConverter;
  return {
    setters: [function (_ServiceFetch) {
      Fetch = _ServiceFetch.Fetch;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      ScriptLine = (function () {
        function ScriptLine(line) {
          _classCallCheck(this, ScriptLine);

          this.actor = line.actor;
          this.action = line.action;
          this.value = line.value;
          this.duration = line.duration;
        }

        _prototypeProperties(ScriptLine, null, {
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

        return ScriptLine;
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