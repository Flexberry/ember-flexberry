"use strict";
const skipConfirmationFunc = require('../utils/skip-confirmation');
const fs = require("fs");
const path = require("path");
const ModelBlueprint = require('../flexberry-model/ModelBlueprint');
module.exports = {
    description: 'Generates core-offline entities for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean },
        { name: 'enable-offline', type: Boolean }
    ],
    supportsAddon: function () {
        return false;
    },

    createOfflineSchema: function (options) {
        let modelsDir = path.join(options.metadataDir, "models");
        var listModels = fs.readdirSync(modelsDir);
        var models = [];
        for (var _i = 0, listModels_1 = listModels; _i < listModels_1.length; _i++) {
            var modelName = listModels_1[_i];
            var model = ModelBlueprint.default.loadModel(modelsDir, modelName);
            var attrs = model.attrs.map((a) => a.name).join(",");
            var belongsTo = model.belongsTo.map((a) => a.name).join(",");
            var hasMany = model.hasMany.map((a) => { return "*" + a.name }).join(",");
            models.push("'" + modelName +  "': 'id"
                + this.updateOfflineSchemaString(attrs)
                + this.updateOfflineSchemaString(belongsTo)
                + this.updateOfflineSchemaString(hasMany) + "'");
        }

        return models.join(",\n\t\t\t");
    },

    updateOfflineSchemaString: function (valueString) {
        if (valueString != undefined && valueString !== "") {
            valueString = "," + valueString;
        } else {
          valueString = "";
        }

        return valueString;
    },

    processFiles(intoDir, templateVariables) {
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
        return {
            offlineSchema: this.createOfflineSchema(options),
            enableOffline: options.enableOffline
        };
    }
};
//# sourceMappingURL=index.js.map
