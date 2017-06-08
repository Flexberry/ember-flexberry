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
      '  app.import(\'vendor/fonts/crim.otf\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/crim.svg\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/crim.ttf\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/crim.woff\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/fonts/crim.woff2\', { destDir: \'assets/fonts\' });\n' +
      '  app.import(\'vendor/serviceImages/close.png\', { destDir: \'assets/serviceImages\' });\n' +
      '  app.import(\'vendor/serviceImages/close-hover.png\', { destDir: \'assets/serviceImages\' });\n' +
      '  app.import(\'vendor/serviceImages/Plus.png\', { destDir: \'assets/serviceImages\' });\n' +
      '  app.import(\'vendor/serviceImages/Minus.png\', { destDir: \'assets/serviceImages\' });\n';
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

    /*
      Following packages should be installed as dependencies of `ember-flexberry-data`:
      `ember-browserify`, `dexie`.
	  Also `app/browserify.js` should be removed when check this.
    */

    return this.insertIntoFile(
      'ember-cli-build.js',
      imports,
      {
        before: '  return app.toTree();\n'
      }
    ).then(function() {
      return _this.insertIntoFile(
        'ember-cli-build.js',
        options,
        {
          after: '  var app = new EmberApp(defaults, {\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'ember-cli-build.js',
        options,
        {
          after: '  var app = new EmberAddon(defaults, {\n'
        }
      );
    }).then(function() {
      return _this.insertIntoFile(
        'app/index.html',
        '    <script src="//cdn.polyfill.io/v1/polyfill.js?features=es6"></script>',
        {
          after: '    <script src="assets/dummy.js"></script>\n'
        }
      );
    }).then(function() {
      return _this.addBowerPackagesToProject([
        { name: 'semantic-ui-daterangepicker', target: '5d46ed2e6e5a0bf398bb6a5df82e06036dfc46be' },
        { name: 'flatpickr-calendar', source: 'git://github.com/chmln/flatpickr.git', target: '2.3.4' },
        { name: 'blueimp-file-upload', target: '9.11.2' },
        { name: 'devicejs', target: '0.2.7' }
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
    });
  },

  normalizeEntityName: function() {}
};
