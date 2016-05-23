"use strict";
const fs = require("fs");
const path = require('path');
const stripBom = require("strip-bom");
module.exports = {
    description: 'Generates an ember-data enum for flexberry.',
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
     * @return {Object} Сustom template variables.
     */
    locals: function (options) {
        let enumBlueprint = new EnumBlueprint(this, options);
        return {
            className: enumBlueprint.className,
            name: enumBlueprint.name,
            enumObjects: enumBlueprint.enumObjects // for use in files\__root__\enums\__name__.js
        };
    }
};
class EnumBlueprint {
    constructor(blueprint, options) {
        let enumsDir = path.join(options.metadataDir, "enums");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        let enumFile = path.join(enumsDir, options.file);
        let content = stripBom(fs.readFileSync(enumFile, "utf8"));
        let enumeration = JSON.parse(content);
        this.name = options.entity.name;
        this.className = enumeration.className;
        let values = [];
        for (let key in enumeration.enumObjects) {
            let caption = enumeration.enumObjects[key];
            if (caption)
                caption = `'${caption}'`;
            else
                caption = `'${key}'`;
            ;
            values.push(`${key}: ${caption}`);
        }
        this.enumObjects = `{\n  ${values.join(",\n  ")}\n}`;
    }
}
//# sourceMappingURL=index.js.map