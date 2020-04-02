const fs = require('fs-extra')
module.exports = {
	afterInstall: function() {
		var _this = this;

		var lessOption = '		\'bower_components/ember-flexberry-themes\''

		var themeConfig = '\n' + '/* Path to semantic ui theme packages */\n' +
		' @semanticUiThemesFolder : \'src/themes\';\n' +
		'\n' +
		'/* Path to ember flexberry theme packages */\n' +
		'@emberFlexberryThemesFolder : \'src/themes\';'
		
		var fontsImports = '\n  // GOSTUI2\n' +
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

		return this.insertIntoFile(
		  'ember-cli-build.js',
		  lessOption,
		  {
				after: '    lessOptions: {\n' + '      paths: [\n'
		  }
		).then(function() {
		  return _this.insertIntoFile(
				'theme.config',
				themeConfig,
				{
					after: '            Folders\n' + '*******************************/\n'
				}
		  );
		}).then(function() {
		  return _this.insertIntoFile(
				'app\styles\app.less',
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
			return _this.addPackageToProject('ember-flexberry-themes', '0.1.0-alpha.1');
		}).then(function() {
			fs.copySync('node_modules/ember-flexberry-themes/src/themes/gos/assets', 'vendor');
			fs.copySync('node_modules/ember-flexberry-themes/src/theme.less', 'app/styles/theme.less');
		});
	}
};
