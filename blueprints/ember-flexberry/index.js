/* globals module */
module.exports = {
  afterInstall: function() {
    var _this = this;
    var imports = '  app.import(\'vendor/font-icon.css\');\n' +
      '  app.import(\'vendor/fonts/icons.eot\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/icons.otf\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/icons.svg\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/icons.ttf\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/icons.woff\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/icons.woff2\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/crim.eot\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/crim.svg\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/crim.ttf\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/crim.woff\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/crim.woff2\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/serviceImages/close.png\', { destDir: \'assets/themes/blue-sky/assets/images\' });\n' +
      '  app.import(\'vendor/serviceImages/close-hover.png\', { destDir: \'assets/themes/blue-sky/assets/images\' });\n' +
      '  app.import(\'vendor/serviceImages/plus.png\', { destDir: \'assets/themes/blue-sky/assets/images\' });\n' +
      '  app.import(\'vendor/serviceImages/minus.png\', { destDir: \'assets/themes/blue-sky/assets/images\' });\n' +
      '  app.import(\'vendor/serviceImages/header-bgw.png\', { destDir: \'assets/themes/orange/assets/images\' });\n' +
      '  app.import(\'vendor/serviceImages/bgw-head-calendar.png\', { destDir: \'assets/themes/orange/assets/images\' });\n';
    var options = '    jscsOptions: {\n' +
      '      enabled: true,\n' +
      '      esnext: true,\n' +
      '      configPath: \'./.jscsrc\'\n' +
      '    },\n' +
      '    lessOptions: {\n' +
      '      paths: [\n' +
      '        \'bower_components/semantic-ui\'\n' +
      '      ]\n' +
      '    },\n' +
      '    SemanticUI: {\n' +
      '      import: {\n' +
      '        css: false,\n' +
      '        javascript: true,\n' +
      '        images: false,\n' +
      '        fonts: true\n' +
      '      }\n' +
      '    }\n';

    var env1 = '  // Replace this local address to remote when backed will be published.\n' +
      '  var backendUrl = \'http://localhost:6500\';\n\n' +
      '  if (environment === \'development-loc\') {\n' +
      '    // Use `ember s -e development-loc` command for local backend usage.\n' +
      '    backendUrl = \'http://localhost:6500\';\n' +
      '  }\n\n';

    var env2 = '      LOG_STACKTRACE_ON_DEPRECATION: false,\n';

    var env3 ='      // Application name. Used in `user-settings` service.\n' +
      '      name: \'ember-app\',\n\n' +
      '      backendUrl: backendUrl,\n\n' +
      '      // It\'s a custom property, used to prevent duplicate backend urls in sources.\n' +
      '      backendUrls: {\n' +
      '        root: backendUrl,\n' +
      '        api: backendUrl + \'/odata\'\n' +
      '      },\n\n' +
      '      // Log service settings.\n' +
      '      log: {\n' +
      '        // Flag: indicates whether log service is enabled or not.\n' +
      '        enabled: true,\n\n' +
      '        // Flag: indicates whether to store error messages or not.\n' +
      '        storeErrorMessages: true,\n' +
      '        storeWarnMessages: false,\n' +
      '        storeLogMessages: true,\n' +
      '        storeInfoMessages: false,\n' +
      '        storeDebugMessages: false,\n' +
      '        storeDeprecationMessages: false,\n' +
      '        storePromiseErrors: true,\n' +
      '        showPromiseErrors: true,\n' +
      '      },\n\n' +
      '      // Options for Perforator service that can be used to calculate performance of components rendering.\n' +
      '      perf: {\n' +
      '        enabled: false,\n' +
      '      },\n\n' +
      '      // Lock settings.\n' +
      '     lock: {\n' +
      '        enabled: true,\n' +
      '        openReadOnly: true,\n' +
      '        unlockObject: true,\n' +
      '      },\n\n' +
      '      // Flag: indicates whether to use user settings service or not.\n' +
      '      useUserSettingsService: true,\n\n' +
      '      // Flag: indicates whether to use adv limit service or not.\n' +
      '      useAdvLimitService: true,\n\n' +
      '      // Custom property with offline mode settings.\n' +
      '      offline: {\n' +
      '        dbName: \'ember-app\',\n\n' +
      '        // Flag that indicates whether offline mode in application is enabled or not.\n' +
      '        offlineEnabled: true,\n\n' +
      '        // Flag that indicates whether to switch to offline mode when got online connection errors or not.\n' +
      '        modeSwitchOnErrorsEnabled: false,\n\n' +
      '        // Flag that indicates whether to sync down all work with records when online or not.\n' +
      '        // This let user to continue work without online connection.\n' +
      '        syncDownWhenOnlineEnabled: false,\n' +
      '      },\n\n' +
      '      // Custom property with components settings.\n' +
      '      components: {\n' +
      '        // Settings for `flexberry-file` component.\n' +
      '        flexberryFile: {\n' +
      '          // URL of file upload controller.\n' +
      '          uploadUrl: backendUrl + \'/api/File\',\n\n' +
      '          // Max file size in bytes for uploading files.\n' +
      '          maxUploadFileSize: null,\n\n' +
      '          // Flag: indicates whether to upload file on controllers modelPreSave event.\n' +
      '          uploadOnModelPreSave: true,\n\n' +
      '          // Flag: indicates whether to show upload button or not.\n' +
      '          showUploadButton: true,\n\n' +
      '          // Flag: indicates whether to show modal dialog on upload errors or not.\n' +
      '          showModalDialogOnUploadError: true,\n\n' +
      '          // Flag: indicates whether to show modal dialog on download errors or not.\n' +
      '          showModalDialogOnDownloadError: true,\n' +
      '        }\n' +
      '      },\n';

    var env4 ='\n  // Read more about CSP:\n' +
      '  // http://www.ember-cli.com/#content-security-policy\n' +
      '  // https://github.com/rwjblue/ember-cli-content-security-policy\n' +
      '  // http://content-security-policy.com\n' +
      '  ENV.contentSecurityPolicy = {\n' +
      '    \'style-src\': "\'self\' \'unsafe-inline\' https://fonts.googleapis.com",\n' +
      '    \'font-src\': "\'self\' data: https://fonts.gstatic.com",\n' +
      '    \'connect-src\': "\'self\' " + ENV.APP.backendUrls.root\n' +
      '  };\n\n' +
      '  // Read more about ember-i18n: https://github.com/jamesarosen/ember-i18n.\n' +
      '  ENV.i18n = {\n' +
      '    // Should be defined to avoid ember-i18n deprecations.\n' +
      '    // Locale will be changed then to navigator current locale (in instance initializer).\n' +
      '    defaultLocale: \'ru\'\n' +
      '  };\n\n' +
      '  // Read more about ember-moment: https://github.com/stefanpenner/ember-moment.\n' +
      '  // Locale will be changed then to same as ember-i18n locale (and will be changed every time when i18n locale changes).\n' +
      '  ENV.moment = {\n' +
      '    outputFormat: \'L\'\n' +
      '  };\n';

    /*
      Following packages should be installed as dependencies of `ember-flexberry-data`:
      `ember-browserify`, `dexie`.
	  Also `app/browserify.js` should be removed when check this.
    */

    return this.insertIntoFile(
      'ember-cli-build.js',
      imports,
      {
        before: '\n  return app.toTree();\n'
      }
    ).then(function() {
      return _this.insertIntoFile(
        'ember-cli-build.js',
        options,
        {
          after: 'var app = new EmberApp(defaults, {\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'ember-cli-build.js',
        options,
        {
          after: 'var app = new EmberAddon(defaults, {\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'app/index.html',
        '\n    <script src="//cdn.polyfill.io/v1/polyfill.js?features=es6"></script>',
        {
          after: '{{content-for "body"}}\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'app/index.html',
        '    <link rel="icon" href="assets/images/favicon.ico">\n',
        {
          after: '<link rel="stylesheet" href="assets/ember-app.css">\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'tests/index.html',
        '\n    <script src="//cdn.polyfill.io/v1/polyfill.js?features=es6"></script>',
        {
          after: '{{content-for "test-body"}}\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'tests/dummy/app/index.html',
        '\n    <script src="//cdn.polyfill.io/v1/polyfill.js?features=es6"></script>',
        {
          after: '{{content-for "body"}}\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'tests/dummy/app/index.html',
        '    <link rel="icon" href="assets/images/favicon.ico">\n',
        {
          after: '<link rel="stylesheet" href="assets/dummy.css">\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'config/environment.js',
        env1,
        {
          after: 'module.exports = function(environment) {\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'config/environment.js',
        env2,
        {
          after: 'EmberENV: {\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'config/environment.js',
        env3,
        {
          after: 'APP: {\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'config/environment.js',
        env4,
        {
          before: '\n  if (environment === \'development\') {\n'
        }
      );
    }).then(function() {
      return _this.addBowerPackagesToProject([
        { name: 'semantic-ui-daterangepicker', target: '5d46ed2e6e5a0bf398bb6a5df82e06036dfc46be' },
        { name: 'flatpickr-calendar', source: 'git://github.com/chmln/flatpickr.git', target: '2.3.4' },
        { name: 'blueimp-file-upload', target: '9.11.2' },
        { name: 'devicejs', target: '0.2.7' },
        { name: 'seiyria-bootstrap-slider', target: '6.0.6' },
        { name: 'jquery-minicolors', target: '2.2.6' },
        { name: 'js-beautify', target: '1.6.4' }
      ]);
    }).then(function() {
      return _this.addBowerPackageToProject('semantic-ui','git://github.com/Flexberry/Semantic-UI.git#fixed-abort');
    }).then(function() {
      return _this.addAddonsToProject({
        packages: [
          { name: 'ember-moment', target: '6.0.0' },
          { name: 'ember-link-action', target: '0.0.34' },
          { name: 'ember-cli-less', target: '1.5.4' },
          { name: 'broccoli-jscs', target: '1.2.2' },
          { name: 'ember-browserify', target: '1.1.9' }
        ]
      });
    }).then(function () {
      return _this.addPackagesToProject([
        { name: 'dexie', target: '1.4.2' },
        { name: 'node-uuid', target: '1.4.7' },
        { name: 'inflection', target: '1.10.0' }
      ]);
    }).then(function () {
      return _this.addPackageToProject('semantic-ui-ember','git://github.com/Flexberry/Semantic-UI-Ember.git#version-0.9.3');
    }).then(function () {
      return _this.removePackagesFromProject([
        { name: 'ember-data' },
        { name: 'ember-inflector' }
      ]);
    }).then(function () {
      return _this.addAddonsToProject({
        packages: [
          { name: 'ember-data', target: '2.4.3' },
          { name: 'ember-block-slots', target: '1.1.3' }
        ]
      });
    });
  },

  normalizeEntityName: function() {}
};
