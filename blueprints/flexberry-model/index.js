/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
var ModelBlueprint_1 = require('./ModelBlueprint');
var lodash = require('lodash');
module.exports = {
    description: 'Generates an ember-data model for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String }
    ],
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
        var modelBlueprint = new ModelBlueprint_1["default"](this, options);
        return lodash.defaults({
            parentModelName: modelBlueprint.parentModelName,
            parentClassName: modelBlueprint.parentClassName,
            model: modelBlueprint.model,
            validations: modelBlueprint.validations,
            projections: modelBlueprint.projections,
            serializerAttrs: modelBlueprint.serializerAttrs,
            name: modelBlueprint.name,
            needsAllModels: modelBlueprint.needsAllModels,
            needsAllEnums: modelBlueprint.needsAllEnums // for use in files\tests\unit\serializers\__name__.js
        }, modelBlueprint.lodashVariables);
    }
};
