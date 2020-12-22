/* eslint-disable node/no-extraneous-require */
/* eslint-disable node/no-unsupported-features/es-syntax */
/*jshint node:true*/
const stringUtils = require('ember-cli-string-utils');

module.exports = {
  description: 'Generates default user setting for model and registy in instance-initializers.',

  availableOptions: [
    {
      name: "with-index-default-user-setting",
      type: Boolean,
      default: false
    }
  ],

  locals(options) {
    const modelName = stringUtils.dasherize(options.entity.name);

    return {
      modelName: modelName,
      withIndexDefaultUserSetting: options.withIndexDefaultUserSetting
    };
  },

  beforeInstall(options) {
    this.withIndexDefaultUserSetting = options.withIndexDefaultUserSetting;
  },

  beforeUninstall(options) {
    this.withIndexDefaultUserSetting = options.withIndexDefaultUserSetting;
  },

  files() {
    let files = this._super.files.apply(this, arguments);

    if (this.withIndexDefaultUserSetting === false) {
      const index = files.indexOf('__root__/default-user-settings/index.js');
      if (index !== -1) {
        files.splice(index, 1);
      }
    }

    return files;
  },

  afterInstall: function (options) {
    const dasherizedName = stringUtils.dasherize(options.entity.name);
    options.path = dasherizedName;

    const initializerComponentPath = 'app/default-user-settings/index.js';
    const appPath = 'app/app.js';
    const upperCaseModelName = stringUtils.classify(dasherizedName);
    const importString = `import ${upperCaseModelName} from './${dasherizedName}';\n`;
    const importIndexString = `import './default-user-settings/index';`

    return this.insertIntoFile(
      initializerComponentPath,
      importString
    ).then(() => {
      if (this.withIndexDefaultUserSetting) {
        return this.insertIntoFile(
          appPath,
          importIndexString,
          {
            before: '\nlet App;'
          }
        );
      }
    });
  },
};
