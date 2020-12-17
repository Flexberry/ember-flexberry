"use strict";
/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
var ModelBlueprint_1 = require("./ModelBlueprint");
var lodash = require("lodash");
var path = require("path");
var CommonUtils_1 = require("../flexberry-common/CommonUtils");
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

    _files: null,
    isDummy: false,
    files: function () {
        if (this._files) {
            return this._files;
        }
        this.isDummy = this.options.dummy;
        var modelsDir = path.join(this.options.metadataDir, "models");
        if (!this.options.file) {
            this.options.file = this.options.entity.name + ".json";
        }
        var model = ModelBlueprint_1.default.loadModel(modelsDir, this.options.file);
        if (!model.offline) {
            this._files = CommonUtils_1.default.getFilesForGeneration(this, function (v) { return v === "__root__/mixins/regenerated/serializers/__name__-offline.js"; });
        }
        else {
            this._files = CommonUtils_1.default.getFilesForGeneration(this);
        }
        return this._files;
    },

    afterInstall: function (options) {
        if (this.project.isEmberCLIAddon()) {
            CommonUtils_1.default.installFlexberryAddon(options, ["model", "serializer"]);
        }
    },

    processFiles: function (intoDir, templateVariables) {
        const skipConfirmation = this.options.skipConfirmation;
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
        return lodash.defaults({
            namespace: modelBlueprint.namespace,
            parentModelName: modelBlueprint.parentModelName,
            parentClassName: modelBlueprint.parentClassName,
            model: modelBlueprint.model,
            projections: modelBlueprint.projections,
            validations: modelBlueprint.validations,
            serializerAttrs: modelBlueprint.serializerAttrs,
            offlineSerializerAttrs: modelBlueprint.offlineSerializerAttrs,
            name: modelBlueprint.name,
            needsAllModels: modelBlueprint.needsAllModels,
            needsAllEnums: modelBlueprint.needsAllEnums,
            needsAllObjects: modelBlueprint.needsAllObjects,
            enumImports: modelBlueprint.enumImports
        }, modelBlueprint.lodashVariables);
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
