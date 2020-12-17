"use strict";
var ModelBlueprint_1 = require("../flexberry-model/ModelBlueprint");
const skipConfirmationFunc = require('../utils/skip-confirmation');
module.exports = {
    description: 'Generates an ember-data model for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean }
    ],

    supportsAddon: function () {
        return false;
    },

    processFiles: function (intoDir, templateVariables) {
        let skipConfirmation = this.options.skipConfirmation;
        if (skipConfirmation) {
            return skipConfirmationFunc(this, intoDir, templateVariables);
        }
        return this._super.processFiles.apply(this, [intoDir, templateVariables]);
    },

    /**
     * Blueprint Hook locals.
     * Use locals to add custom template variables. The method receives one argument: options.
     *
     * @method locals
     * @public
     *
     * @param {Object} options Options is an object containing general and entity-specific options.
     * @return {Object} Custom template variables.
     */
    locals: function (options) {
        var modelBlueprint = new ModelBlueprint_1.default(this, options);
        return {
            namespace: modelBlueprint.namespace,
            className: modelBlueprint.className,
            parentModelName: modelBlueprint.parentModelName,
            parentClassName: modelBlueprint.parentClassName,
            parentExternal: modelBlueprint.parentExternal,
            name: modelBlueprint.name,
            projections: modelBlueprint.projections
        };
    },

    /**
     * Blueprint Hook filesPath.
     * Override the default files directory. Useful for switching between file sets conditionally.
     *
     * @method filesPath
     * @public
     *
     * @param {Object} options Options is an object containing general and entity-specific options.
     * @return {String} Overridden files directory.
     */
    filesPath: function (options) {
        const filesPathSuffix = ModelBlueprint_1["default"].checkCpValidations(this) ? '-cp-validations' : '';
        return this._super.filesPath.apply(this, [options]) + filesPathSuffix;
    }
};
//# sourceMappingURL=index.js.map
