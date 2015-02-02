System.config({
  "paths": {
    "*": "*.js",
    "MonkeyRider/*": "app/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "lodash": "npm:lodash@3.0.1",
    "github:jspm/nodelibs-process@0.1.0": {
      "process": "npm:process@0.10.0"
    },
    "npm:lodash@3.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.0"
    }
  }
});

