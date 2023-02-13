"use strict";
var ModelBlueprint_1 = require("../flexberry-model/ModelBlueprint");
const path = require("path");
const skipConfirmationFunc = require("../utils/skip-confirmation");
module.exports = {
    description: 'Generates an ember-data model for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean },
        { name: 'enable-offline', type: Boolean },
        { name: 'enable-audit', type: Boolean }
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

        const noParent = !modelBlueprint.parentModelName;
        const isOffline = this.options.enableOffline;
        const isAudit = this.options.enableAudit;

        let additionalModelMixin = '';
        let additionalModelMixinImport = '';

        if (noParent) {
            additionalModelMixin = isAudit ? 'AuditModelMixin' : '';
            additionalModelMixinImport = isAudit ? '\'ember-flexberry-data/mixins/audit-model\'' : '';

            additionalModelMixin = isOffline ? 'OfflineModelMixin' : additionalModelMixin;
            additionalModelMixinImport = isOffline ? '\'ember-flexberry-data/mixins/offline-model\'' : additionalModelMixinImport;
        }

        return {
            namespace: modelBlueprint.namespace,
            className: modelBlueprint.className,
            parentModelName: modelBlueprint.parentModelName,
            parentClassName: modelBlueprint.parentClassName,
            parentExternal: modelBlueprint.parentExternal,
            name: modelBlueprint.name,
            projections: modelBlueprint.projections,
            additionalModelMixin: additionalModelMixin,
            additionalModelMixinImport: additionalModelMixinImport
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
        const filesSubDir = ModelBlueprint_1.default.checkCpValidations(this) ? 'files-cp-validations' : 'files-ember-validations';
        return path.join(this._super.filesPath.apply(this, [ options ]), filesSubDir);
    }
};
//# sourceMappingURL=index.js.map
