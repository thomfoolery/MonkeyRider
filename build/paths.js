var path = require('path');

var appRoot = 'edit/';

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  style: 'styles/**/*.scss',
  output: 'edit_dist/',
  doc:'./doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/'
};
