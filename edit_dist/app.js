System.register(["aurelia-router"], function (_export) {
  "use strict";

  var Router, _prototypeProperties, _classCallCheck, App;
  return {
    setters: [function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      App = _export("App", (function () {
        function App(router) {
          _classCallCheck(this, App);

          this.router = router;
          this.router.configure(function (config) {
            config.title = "Monkey Rider";


            config.map([{
              route: [""],
              moduleId: "home",
              title: "Home",
              nav: true
            }, {
              route: ["scene"],
              moduleId: "scene/index",
              title: "Scene Editor",
              nav: true
            }, {
              route: ["scene/:sceneID"],
              moduleId: "scene/index"
            }, {
              route: ["script/:sceneID/:spriteID"],
              moduleId: "script/index"
            }]);
          });
        }

        _prototypeProperties(App, {
          inject: {
            value: function inject() {
              return [Router];
            },
            writable: true,
            configurable: true
          }
        });

        return App;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7TUFBUyxNQUFNLHlDQUVGLEdBQUc7OztBQUZQLFlBQU0sa0JBQU4sTUFBTTs7Ozs7OztBQUVGLFNBQUc7QUFJSCxpQkFKQSxHQUFHLENBSUQsTUFBTTtnQ0FKUixHQUFHOztBQU1aLGNBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFFLFVBQUEsTUFBTSxFQUFJO0FBRS9CLGtCQUFNLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQzs7O0FBRzlCLGtCQUFNLENBQUMsR0FBRyxDQUFDLENBQ1Q7QUFDRSxtQkFBSyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ1gsc0JBQVEsRUFBRSxNQUFNO0FBQ2hCLG1CQUFLLEVBQUMsTUFBTTtBQUNaLGlCQUFHLEVBQUUsSUFBSTthQUNWLEVBQUM7QUFDQSxtQkFBSyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQ2hCLHNCQUFRLEVBQUUsYUFBYTtBQUN2QixtQkFBSyxFQUFDLGNBQWM7QUFDcEIsaUJBQUcsRUFBRSxJQUFJO2FBQ1YsRUFBQztBQUNBLG1CQUFLLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUN6QixzQkFBUSxFQUFFLGFBQWE7YUFDeEIsRUFBQztBQUNBLG1CQUFLLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztBQUNwQyxzQkFBUSxFQUFFLGNBQWM7YUFDekIsQ0FDRixDQUFDLENBQUM7V0FFSixDQUFDLENBQUM7U0FFSjs7NkJBbENVLEdBQUc7QUFFUCxnQkFBTTttQkFBQSxrQkFBRztBQUFFLHFCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7YUFBRTs7Ozs7O2VBRnpCLEdBQUciLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9lZGl0LyJ9