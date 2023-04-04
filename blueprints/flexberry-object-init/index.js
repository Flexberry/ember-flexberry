/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
var stripBom = require("strip-bom");
var fs = require("fs");
var path = require('path');
const skipConfirmationFunc = require('../utils/skip-confirmation');
module.exports = {
    description: 'Generates an ember object for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean }
    ],
    supportsAddon: function () {
        return false;
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
     * @return {Object} Custom template variables.
     */
    locals: function (options) {
        var objectsDir = path.join(options.metadataDir, "objects");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        var objectFile = path.join(objectsDir, options.file);
        var content = stripBom(fs.readFileSync(objectFile, "utf8"));
        var object = JSON.parse(content);
        return {
            className: object.className,
            name: object.name,
        };
    }
};
//# sourceMappingURL=index.js.map