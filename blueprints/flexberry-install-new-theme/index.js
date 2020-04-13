const fs = require('fs-extra')
module.exports = {
	afterInstall: function() {
		var _this = this;

		var lessOption = '        \'node_modules/ember-flexberry-themes\','

		var fontsImports = '\n  app.import(\'vendor/fonts.css\');\n' +
		'\n  // GOSTUI2\n' +
		'  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w170-regular_g_temp.eot\', { destDir: \'assets/fonts\' });\n' +
		'  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w170-regular_g_temp.ttf\', { destDir: \'assets/fonts\' });\n' +
		'  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w170-regular_g_temp.woff\', { destDir: \'assets/fonts\' });\n' +
		'  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w170-regular_g_temp.woff2\', { destDir: \'assets/fonts\' });\n' +
		'  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w450-medium_g_temp.eot\', { destDir: \'assets/fonts\' });\n' +
		'  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w450-medium_g_temp.ttf\', { destDir: \'assets/fonts\' });\n' +
		'  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w450-medium_g_temp.woff\', { destDir: \'assets/fonts\' });\n' +
    '  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w450-medium_g_temp.woff2\', { destDir: \'assets/fonts\' });\n' +
    '  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w706-bold_g_temp.eot\', { destDir: \'assets/fonts\' });\n' +
		'  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w706-bold_g_temp.ttf\', { destDir: \'assets/fonts\' });\n' +
    '  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w706-bold_g_temp.woff\', { destDir: \'assets/fonts\' });\n' +
    '  app.import(\'vendor/fonts/GOSTUI2/GOSTUI2-w706-bold_g_temp.woff2\', { destDir: \'assets/fonts\' });\n' +
		'\n'

		var stylesImports = '\n  // guideline-icons\n' +
		'  app.import(\'vendor/guideline-icons.css\');\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.eot\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.ttf\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.woff\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.woff2\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.svg\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'\n'

		return this.insertIntoFile(
		  'ember-cli-build.js',
		  lessOption,
		  {
				after: '    lessOptions: {\n' + '      paths: [\n'
		  }
		).then(function() {
		  return _this.insertIntoFile(
				'app/styles/app.less',
				'@import \'src/flexberry-imports\';\n'
		  );
		}).then(function() {
		  return _this.insertIntoFile(
				'ember-cli-build.js',
				fontsImports,
				{
					before: '\n  return app.toTree();\n'
				}
		  );
		}).then(function() {
		  return _this.insertIntoFile(
				'ember-cli-build.js',
				stylesImports,
				{
					before: '\n  return app.toTree();\n'
				}
		  );
		}).then(function() {
      return _this.insertIntoFile('ember-cli-build.js', '\nconst autoprefixer = require(\'autoprefixer\');\n\n', { before: 'module.exports = function' });
    }).then(function() {
      var afterPostcssOptions = 'semantic-ui\'\n      ]\n    }';
      var postcssOptions = ',\n    postcssOptions: {\n' +
        '      compile: {\n' +
        '        enabled: false,\n' +
        '        browsers: [\'last 3 versions\'],\n' +
        '      },\n' +
        '      filter: {\n' +
        '        enabled: true,\n' +
        '        plugins: [\n' +
        '          {\n' +
        '            module: autoprefixer,\n' +
        '            options: {\n' +
        '              browsers: [\'last 2 versions\']\n' +
        '            }\n' +
        '          }\n' +
        '        ]\n' +
        '      }\n' +
        '    }\n';

      return _this.insertIntoFile('ember-cli-build.js', postcssOptions, { after: afterPostcssOptions });
    }).then(function() {
      return _this.insertIntoFile('app/templates/application.hbs', '-guideline ', { after: '{{flexberry-sitemap' });
    }).then(function() {
      return _this.insertIntoFile('app/templates/mobile/application.hbs', '-guideline ', { after: '{{flexberry-sitemap' });
    }).then(function() {
      return _this.addPackagesToProject([
        { name: 'autoprefixer', target: '^6' },
        { name: 'ember-flexberry-themes' }
      ]);
		}).then(function() {
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/gos/assets/fonts', 'vendor/fonts');
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/gos/assets/fonts.css', 'vendor/fonts.css');
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/gos/assets/guideline-icons.css', 'vendor/guideline-icons.css');
			fs.copySync('node_modules/ember-flexberry-themes/src/theme.less', 'app/styles/theme.less');
			fs.copySync('node_modules/ember-flexberry-themes/src/theme.config.example', 'theme.config');
		});
	}
};
