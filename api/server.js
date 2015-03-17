var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 9001 });

server.route({
  method: 'GET',
  path: '/edit/',
  handler: {
    file: function (request) {
      return './edit_dist/index.html';
    }
  }
});

server.route({
  method: 'GET',
  path: '/edit/jspm_packages/{file*}',
  handler: {
    directory: {
      path: './jspm_packages/'
    }
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: {
    file: function (request) {
      return './game/index.html';
    }
  }
});

server.route({
  method: 'GET',
  path: '/{file*}',
  handler: {
    directory: {
      path: './'
    }
  }
});

server.start(function () {
    console.log('Server running at:', server.info.uri );
});