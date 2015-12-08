/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    jscsOptions: {
      enabled: true,
      esnext: true
    }
  });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

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

  app.import({
    development: 'bower_components/datatables/media/js/jquery.dataTables.js',
    production:  'bower_components/datatables/media/js/jquery.dataTables.min.js'
  });

  app.import({
    development: 'bower_components/datatables/media/css/jquery.dataTables.css',
    production:  'bower_components/datatables/media/css/jquery.dataTables.min.css'
  });

  app.import('bower_components/datatables/media/images/sort_asc_disabled.png', {
    destDir: 'images'
  });
  app.import('bower_components/datatables/media/images/sort_asc.png', {
    destDir: 'images'
  });
  app.import('bower_components/datatables/media/images/sort_both.png', {
    destDir: 'images'
  });
  app.import('bower_components/datatables/media/images/sort_desc_disabled.png', {
    destDir: 'images'
  });
  app.import('bower_components/datatables/media/images/sort_desc.png', {
    destDir: 'images'
  });

  // Custom script which fixes some jQuery 1.10.x+ AJAX bugs with code from newer jQuery.3.0.0-alpha1+compat version.
  app.import('vendor/jquery.3.0.0-alpha1+compat/jquery.ajaxreplacement.js');

  if (app.env !== 'production') {
    app.import('bower_components/jquery-mockjax/jquery.mockjax.js');
  }

  return app.toTree();
};
