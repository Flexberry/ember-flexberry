/* eslint-disable node/no-extraneous-require */
/* eslint-disable node/no-unsupported-features/es-syntax */
/*jshint node:true*/
const stringUtils = require('ember-cli-string-utils');

module.exports = {
  description: 'Generates default user setting for model and registy in instance-initializers.',

  availableOptions: [
    {
      name: "with-initializer",
      type: Boolean,
      default: false
    }
  ],

  locals(options) {
    const modelName = stringUtils.dasherize(options.entity.name);

    return {
      modelName: modelName,
      withInitializer: options.withInitializer
    };
  },

  getUpperCaseName(name) {
    name = name[0].toUpperCase() + name.slice(1, name.length);
    while (name.indexOf('-') >= 0) {
      const i = name.indexOf('-');
      name = name.slice(0, i) + name[i + 1].toUpperCase() + name.slice(i + 2, name.length);
    }
    return name;
  },

  beforeInstall(options) {
    this.withInitializer = options.withInitializer;
  },

  beforeUninstall(options) {
    this.withInitializer = options.withInitializer;
  },

  files() {
    let files = this._super.files.apply(this, arguments);

    if (this.withInitializer === false) {
      const index = files.indexOf('__root__/instance-initializers/default-user-settings.js');
      if (index !== -1) {
        files.splice(index, 1);
      }
    }

    return files;
  },

  afterInstall: function (options) {
    const dasherizedName = stringUtils.dasherize(options.entity.name);
    options.path = dasherizedName;

    const initializerComponentPath = 'app/instance-initializers/default-user-settings.js';
    const upperCaseModelName = this.getUpperCaseName(dasherizedName);
    const importString = `import ${upperCaseModelName} from './default-user-settings/${dasherizedName}';`;
    const registerString =
    `  applicationInstance.register('user-setting:${dasherizedName}', ${upperCaseModelName}.DEFAULT, { instantiate: false });`;

    return this.insertIntoFile(
      initializerComponentPath,
      importString,
      {
        before: '/**'
      }
    ).then(() => {
      return this.insertIntoFile(
        initializerComponentPath,
        registerString,
        {
          after: 'export function initialize(applicationInstance) {\n'
        }
      );
    });
  },
};
