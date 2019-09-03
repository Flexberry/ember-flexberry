'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    lessOptions: {
      paths: [
          'bower_components/semantic-ui',
          'bower_components/ember-flexberry-themes',
      ]
    },
    SemanticUI: {
      css: false,
      javascript: true,
      fonts: true
    },
  });

  app.import('vendor/font-icon.css');
  app.import('vendor/fonts/icons.eot', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.otf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.svg', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.ttf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.woff', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/icons.woff2', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.eot', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.svg', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.ttf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.woff', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/crim.woff2', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/outline-icons.eot', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/outline-icons.svg', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/outline-icons.ttf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/outline-icons.woff', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/outline-icons.woff2', { destDir: 'assets/fonts' });

  // GOSTUI2
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w170-regular_g_temp.eot', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w170-regular_g_temp.ttf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w170-regular_g_temp.woff', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w170-regular_g_temp.woff2', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w450-medium_g_temp.eot', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w450-medium_g_temp.ttf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w450-medium_g_temp.woff', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w450-medium_g_temp.woff2', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w706-bold_g_temp.eot', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w706-bold_g_temp.ttf', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w706-bold_g_temp.woff', { destDir: 'assets/fonts' });
  app.import('vendor/fonts/GOSTUI2/GOSTUI2-w706-bold_g_temp.woff2', { destDir: 'assets/fonts' });

  // guideline-icons
  app.import('vendor/fonts/guideline-icons/guideline-icons.eot', { destDir: 'assets/fonts/guideline-icons' });
  app.import('vendor/fonts/guideline-icons/guideline-icons.ttf', { destDir: 'assets/fonts/guideline-icons' });
  app.import('vendor/fonts/guideline-icons/guideline-icons.woff', { destDir: 'assets/fonts/guideline-icons' });
  app.import('vendor/fonts/guideline-icons/guideline-icons.woff2', { destDir: 'assets/fonts/guideline-icons' });
  app.import('vendor/fonts/guideline-icons/guideline-icons.svg', { destDir: 'assets/fonts/guideline-icons' });

  // material-icons
  app.import('vendor/fonts/material-icons/MaterialIcons-Regular.eot', { destDir: 'assets/fonts/material-icons' });
  app.import('vendor/fonts/material-icons/MaterialIcons-Regular.ttf', { destDir: 'assets/fonts/material-icons' });
  app.import('vendor/fonts/material-icons/MaterialIcons-Regular.woff', { destDir: 'assets/fonts/material-icons' });
  app.import('vendor/fonts/material-icons/MaterialIcons-Regular.woff2', { destDir: 'assets/fonts/material-icons' });
  app.import('vendor/fonts/material-icons/MaterialIcons-Regular.svg', { destDir: 'assets/fonts/material-icons' });

  app.import('vendor/serviceImages/close.png', {
    destDir: 'assets/themes/blue-sky/assets/images'
  });
  app.import('vendor/serviceImages/close-hover.png', {
    destDir: 'assets/themes/blue-sky/assets/images'
  });
  app.import('vendor/serviceImages/header-bgw.png', {
    destDir: 'assets/themes/orange/assets/images'
  });
  app.import('vendor/serviceImages/bgw-head-calendar.png', {
    destDir: 'assets/themes/orange/assets/images'
  });
  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  if (app.env !== 'production') {
    app.import('bower_components/jquery-mockjax/dist/jquery.mockjax.js');
  }

  return app.toTree();
};
