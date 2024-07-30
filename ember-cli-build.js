'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    lessOptions: {
      paths: [
          'node_modules/fomantic-ui'
      ]
    },
  });

  app.import('node_modules/dexie/dist/dexie.min.js', {
    using: [
      { transformation: 'amd', as: 'dexie' }
    ]
  });

  app.import('node_modules/fomantic-ui/dist/semantic.min.js', {
    using: [
      { transformation: 'amd', as: 'semantic' }
    ]
  });

  app.import('node_modules/fomantic-ui/dist/semantic.min.css', {
    using: [
      { transformation: 'amd', as: 'semantic' }
    ]
  });

  app.import({
    development: 'node_modules/flatpickr/dist/flatpickr.js',
    production:  'node_modules/flatpickr/dist/flatpickr.min.js'
  });

  app.import('node_modules/flatpickr/dist/flatpickr.min.css');
  app.import('node_modules/flatpickr/dist/l10n/ru.js');

  // Script for mask input.
  app.import('vendor/jquery.maskedinput.min/jquery.maskedinput.min.js');

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
