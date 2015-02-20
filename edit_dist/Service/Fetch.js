System.register(["aurelia-http-client"], function (_export) {
  "use strict";

  var HttpClient, _prototypeProperties, _classCallCheck, http, cache, Fetch;


  function fetchResource(URL) {
    return http.get(URL).then((function resolve(response) {
      cache[URL] = response.content;
      return cache[URL];
    }).bind(this), (function reject(error) {
      console.error(error);
      return error;
    }).bind(this));
  }

  return {
    setters: [function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      http = new HttpClient();
      cache = {};
      Fetch = _export("Fetch", (function () {
        function Fetch() {
          _classCallCheck(this, Fetch);
        }

        _prototypeProperties(Fetch, null, {
          resource: {
            value: function resource(URL) {
              if (cache[URL]) {
                return new Promise(function (resolve) {
                  resolve(cache[URL]);
                });
              }

              return fetchResource(URL);
            },
            writable: true,
            configurable: true
          }
        });

        return Fetch;
      })());
      ;
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UvRmV0Y2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O01BQVEsVUFBVSx5Q0FFZCxJQUFJLEVBQ0osS0FBSyxFQXdCSSxLQUFLOzs7QUF0QmxCLFdBQVMsYUFBYSxDQUFHLEdBQUcsRUFBRztBQUU3QixXQUFPLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFFLENBQUMsSUFBSSxDQUV6QixDQUFBLFNBQVMsT0FBTyxDQUFHLFFBQVEsRUFBRztBQUU1QixXQUFLLENBQUUsR0FBRyxDQUFFLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUNoQyxhQUFPLEtBQUssQ0FBRSxHQUFHLENBQUUsQ0FBQztLQUVyQixDQUFBLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxFQUVkLENBQUEsU0FBUyxNQUFNLENBQUcsS0FBSyxFQUFHO0FBRXhCLGFBQU8sQ0FBQyxLQUFLLENBQUUsS0FBSyxDQUFFLENBQUM7QUFDdkIsYUFBTyxLQUFLLENBQUM7S0FFZCxDQUFBLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxDQUVmLENBQUM7R0FFSDs7OztBQXpCTyxnQkFBVSxzQkFBVixVQUFVOzs7Ozs7O0FBRWQsVUFBSSxHQUFHLElBQUksVUFBVSxFQUFFO0FBQ3ZCLFdBQUssR0FBRyxFQUFFO0FBd0JELFdBQUs7aUJBQUwsS0FBSztnQ0FBTCxLQUFLOzs7NkJBQUwsS0FBSztBQUVoQixrQkFBUTttQkFBQyxrQkFBRSxHQUFHLEVBQUc7QUFFZixrQkFBSyxLQUFLLENBQUUsR0FBRyxDQUFFLEVBQUc7QUFDbEIsdUJBQU8sSUFBSSxPQUFPLENBQUUsVUFBVyxPQUFPLEVBQUc7QUFDdkMseUJBQU8sQ0FBRyxLQUFLLENBQUUsR0FBRyxDQUFFLENBQUUsQ0FBQztpQkFDMUIsQ0FBQyxDQUFDO2VBQ0o7O0FBRUQscUJBQU8sYUFBYSxDQUFFLEdBQUcsQ0FBRSxDQUFDO2FBRTdCOzs7Ozs7ZUFaVSxLQUFLOztBQWdCakIsT0FBQyIsImZpbGUiOiJTZXJ2aWNlL0ZldGNoLmpzIiwic291cmNlUm9vdCI6Ii9lZGl0LyJ9