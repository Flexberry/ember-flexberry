"use strict";
var ModelBlueprint_1 = require('../flexberry-model/ModelBlueprint');
module.exports = {
    description: 'Generates an ember-data model for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String }
    ],
    supportsAddon: function () {
        return false;
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
            projections: modelBlueprint.projections,
        };
    }
};
//# sourceMappingURL=index.js.map