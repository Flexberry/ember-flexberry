var inflector = require("inflection");
const skipConfirmationFunc = require('../utils/skip-confirmation');
module.exports = {
    description: 'Generates an import wrapper.',
    availableOptions: [
        { name: 'middle-path', type: String },
        { name: 'skip-confirmation', type: Boolean }
    ],
    fileMapTokens: function () {
        return {
            __name__: function (options) {
                return options.dasherizedModuleName;
            },
            __path__: function (options) {
                return inflector.pluralize(options.originBlueprintName);
            },
            __root__: function (options) {
                return 'app';
            }
        };
    },

    processFiles(intoDir, templateVariables) {
        let skipConfirmation = this.options.skipConfirmation;
        if (skipConfirmation) {
            return skipConfirmationFunc(this, intoDir, templateVariables);
        }

        return this._super(...arguments);
    },

    /**
    * Blueprint Hook locals.
    * Use locals to add custom template variables. The method receives one argument: options.
    *
    * @method locals
    * @public
    *
    * @param {Object} options Options is an object containing general and entity-specific options.
    * @return {Object} Сustom template variables.
    */
    locals: function (options) {
        return {
            modulePath: options.project.name() + "/" + inflector.pluralize(options.middlePath) + "/" + options.entity.name // for use in files\__root__\__path__\__name__.js
        };
    }
};
//# sourceMappingURL=index.js.map