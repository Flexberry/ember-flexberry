/*jshint node:true*/
/* global require, module */
var Ember<%=projectTypeNameCamel%> = require('ember-cli/lib/broccoli/ember-<%=projectTypeNameCebab%>');

module.exports = function(defaults) {
  var app = new Ember<%=projectTypeNameCamel%>(defaults, {
    jscsOptions: {
      enabled: true,
      esnext: true,
      configPath: './.jscsrc'
    },
    lessOptions: {
      paths: [
        'bower_components/semantic-ui'
      ]
    },
    SemanticUI: {
      import: {
        css: false,
        javascript: true,
        images: false,
        fonts: true
      }
    }
  });

  app.import('vendor/font-icon.css');
  app.import('vendor/fonts/icons.eot', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.otf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.svg', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.ttf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.woff', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.woff2', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.eot', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.otf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.svg', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.ttf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.woff', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.woff2', { destDir: 'assets/fonts' });
  app.import('vendor/serviceImages/close.png', {
    destDir: 'assets/serviceImages'
  });
  app.import('vendor/serviceImages/close-hover.png', {
    destDir: 'assets/serviceImages'
  });
  app.import('vendor/serviceImages/Plus.png', {
    destDir: 'assets/serviceImages'
  });
  app.import('vendor/serviceImages/Minus.png', {
    destDir: 'assets/serviceImages'
  });

  return app.toTree();
};
