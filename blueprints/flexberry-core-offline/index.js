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

    afterInstall: function() {
        this.setOfflineDbNameInEnvironment();
    },

    createOfflineSchema: function (options) {
        let modelsDir = path.join(options.metadataDir, "models");
        let modelsFiles = fs.readdirSync(modelsDir);
        let models = [];
        for (let _i = 0; _i < modelsFiles.length; _i++) {
            let modelFileName = modelsFiles[_i];
            let model = ModelBlueprint.default.loadModel(modelsDir, modelFileName);
            let attrs = model.attrs.map((a) => a.name).join(",");
            let belongsTo = model.belongsTo.map((a) => a.name).join(",");
            let hasMany = model.hasMany.map((a) => { return "*" + a.name }).join(",");
            models.push("'" + model.modelName +  "': 'id"
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

    setOfflineDbNameInEnvironment: function() {
        const projectName = this.options.offlineDbName;
        const dbName = '\n        dbName: \'' + projectName + '\',';
        
        this.insertIntoFile('config/environment.js', dbName, { after: 'offline: {' });
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
