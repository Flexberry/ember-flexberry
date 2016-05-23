"use strict";
var fs = require("fs");
var path = require('path');
var stripBom = require("strip-bom");
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
        var enumBlueprint = new EnumBlueprint(this, options);
        return {
            className: enumBlueprint.className,
            name: enumBlueprint.name,
            enumObjects: enumBlueprint.enumObjects // for use in files\__root__\enums\__name__.js
        };
    }
};
var EnumBlueprint = (function () {
    function EnumBlueprint(blueprint, options) {
        var enumsDir = path.join(options.metadataDir, "enums");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        var enumFile = path.join(enumsDir, options.file);
        var content = stripBom(fs.readFileSync(enumFile, "utf8"));
        var enumeration = JSON.parse(content);
        this.name = options.entity.name;
        this.className = enumeration.className;
        var values = [];
        for (var key in enumeration.enumObjects) {
            var caption = enumeration.enumObjects[key];
            if (caption)
                caption = "'" + caption + "'";
            else
                caption = "'" + key + "'";
            ;
            values.push(key + ": " + caption);
        }
        this.enumObjects = "{\n  " + values.join(",\n  ") + "\n}";
    }
    return EnumBlueprint;
}());
//# sourceMappingURL=index.js.map