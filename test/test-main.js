var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/\.test\.js$/.test(file)) {
      tests.push(file);
    }
  }
}
window.chrome = {
  extension: {
    getURL: function (url, callback) {
    }
  }
};

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base',

  paths: {
    'lib': '/base/lib'
  },

  map: {
    'src/converter': {
      'src/outline': 'test/mock/outline.mock',
      'lib/jszip.min': 'test/mock/jszip.mock',
      'lib/async.min': 'test/mock/async.mock'
    }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});

