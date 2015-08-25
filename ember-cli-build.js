/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    jscsOptions: {
      enabled: true,
      esnext: true
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  if (app.env !== 'production') {
    app.import('bower_components/jquery-mockjax/jquery.mockjax.js');
  }

  app.import({
    development: 'bower_components/moment/min/moment-with-locales.js',
    production:  'bower_components/moment/min/moment-with-locales.min.js'
  });

  app.import({
    development: 'bower_components/semantic-ui-daterangepicker/daterangepicker.js',
    production:  'bower_components/semantic-ui-daterangepicker/daterangepicker.min.js'
  });

  app.import({
    development: 'bower_components/semantic-ui-daterangepicker/daterangepicker.css',
    production:  'bower_components/semantic-ui-daterangepicker/daterangepicker.min.css'
  });

  // Custom build of jQuery.3.0.0-alpha1+compat contains AJAX-only facilities.
  app.import('vendor/jquery.3.0.0-alpha1+compat/jquery.ajaxonly.min.js');

  // Custom script which merges jQuery.3.0.0-alpha1+compat AJAX facilities to ember-related jQuery version.
  app.import('vendor/jquery.3.0.0-alpha1+compat/jquery.ajaxreplacement.js');

  return app.toTree();
};
