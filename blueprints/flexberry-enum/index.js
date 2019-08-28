"use strict";
var fs = require("fs");
var path = require('path');
var stripBom = require("strip-bom");
var CommonUtils_1 = require('../flexberry-common/CommonUtils');
const skipConfirmationFunc = require('../utils/skip-confirmation');
module.exports = {
    description: 'Generates an ember-data enum for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean }
    ],
    supportsAddon: function () {
        return false;
    },
    afterInstall: function (options) {
        if (this.project.isEmberCLIAddon()) {
            CommonUtils_1.default.installFlexberryAddon(options, ["enum", "transform"]);
        }
    },

    processFiles(intoDir, templateVariables) {
        let skipConfirmation = this.options.skipConfirmation;
        if (skipConfirmation) {
            return skipConfirmationFunc(this, intoDir, templateVariables);
        }

        return this._super.processFiles.appy(this, [intoDir, templateVariables]);
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
        var enumBlueprint = new EnumBlueprint(this, options);
        return {
            className: enumBlueprint.className,
            sourceType: enumBlueprint.sourceType,
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
        this.sourceType = enumeration.nameSpace == null ? enumeration.className : enumeration.nameSpace + "." + enumeration.className;
        var values = [];
        for (var key in enumeration.enumObjects) {
            var caption = enumeration.enumObjects[key];
            if (caption === "~")
                caption = "";
            if (caption != null)
                caption = "'" + caption + "'";
            else
                caption = "'" + key + "'";
            values.push(key + ": " + caption);
        }
        this.enumObjects = "{\n  " + values.join(",\n  ") + "\n}";
    }
    return EnumBlueprint;
}());
//# sourceMappingURL=index.js.map