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
			return _this.addPackageToProject('ember-flexberry-themes');
		}).then(function() {
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/gos/assets/fonts', 'vendor/fonts');
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/gos/assets/fonts.css', 'vendor/fonts.css');
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/gos/assets/guideline-icons.css', 'vendor/guideline-icons.css');
			fs.copySync('node_modules/ember-flexberry-themes/src/theme.less', 'app/styles/theme.less');
			fs.copySync('node_modules/ember-flexberry-themes/src/theme.config.example', 'theme.config');
		});
	}
};
