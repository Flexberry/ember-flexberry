const fs = require('fs-extra')
module.exports = {
	afterInstall: function() {
		let _this = this;

    let configEnvironmentFile = 'config/environment.js';
    let configEnvironmentAfter = 'showModalDialogOnDownloadError: true,\n        }';
    let configEnvironmentContent = ',\n\n        // For guideline theme\n' +
      '        // Settings for flexberry-objectlistview component.\n' +
      '        flexberryObjectlistview: {\n' +
      '          // Flag indicates whether to side page or usually mode.\n' +
      '          useSidePageMode: true,\n' +
      '        },\n\n' +
      '        // Settings for flexberry-lookup component.\n' +
      '        flexberryLookup: {\n' +
      '          // Flag: indicates whether to side page or usually mode.\n' +
      '          useSidePageMode: true,\n' +
      '        },\n\n' +
      '        flexberryGroupedit: {\n' +
      '          // Flag: indicates whether to side page or usually mode.\n' +
      '          useSidePageMode: true,\n' +
      '          // Flag: indicates whether to show asterisk icon in first column of every changed row.\n' +
      '          showAsteriskInRow: false,\n' +
      '        },\n\n' +
      '        flexberrySimpledatetime: {\n' +
      '          // The selector to get the element (using `jQuery`) for the `appendTo` flatpickr option, see https://flatpickr.js.org/options/.\n' +
      '          calendarContext: undefined\n' +
      '        }';

		let fontsImports = '\n  app.import(\'vendor/fonts.css\');\n' +
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

		let stylesImports = '\n  // guideline-icons\n' +
		'  app.import(\'vendor/guideline-icons.css\');\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.eot\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.ttf\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.woff\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.woff2\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'  app.import(\'vendor/fonts/guideline-icons/guideline-icons.svg\', { destDir: \'assets/fonts/guideline-icons\' });\n' +
		'\n'

		return _this.insertIntoFile(
			'ember-cli-build.js',
			fontsImports,
			{
				before: '\n  return app.toTree();\n'
			}
		).then(function() {
		  return _this.insertIntoFile(
				'ember-cli-build.js',
				stylesImports,
				{
					before: '\n  return app.toTree();\n'
				}
		  );
		}).then(function() {
      return _this.insertIntoFile('app/templates/application.hbs', '-guideline ', { after: '{{flexberry-sitemap' });
    }).then(function() {
      return _this.insertIntoFile('app/templates/mobile/application.hbs', '-guideline ', { after: '{{flexberry-sitemap' });
    }).then(function() {
      return _this.insertIntoFile(configEnvironmentFile, configEnvironmentContent, { after: configEnvironmentAfter });
    }).then(function() {
      return _this.insertIntoFile('tests/dummy/' + configEnvironmentFile, configEnvironmentContent, { after: configEnvironmentAfter });
		}).then(function() {
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/ghost/assets/fonts', 'vendor/fonts');
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/ghost/assets/fonts.css', 'vendor/fonts.css');
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/ghost/assets/guideline-icons.css', 'vendor/guideline-icons.css');
			fs.copySync('node_modules/ember-flexberry-themes/src/theme.config.example', 'theme.config');
		});
	}
};
