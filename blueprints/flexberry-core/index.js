/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
var stripBom = require("strip-bom");
var fs = require("fs");
var path = require('path');
module.exports = {
    description: 'Generates core entities for flexberry.',
    availableOptions: [
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
        var coreBlueprint = new CoreBlueprint(this, options);
        return {
            children: coreBlueprint.children,
            routes: coreBlueprint.routes,
            importProperties: coreBlueprint.importProperties,
            formsImportedProperties: coreBlueprint.formsImportedProperties,
            modelsImportedProperties: coreBlueprint.modelsImportedProperties // for use in files\__root__\locales\**\translations.js
        };
    }
};
var CoreBlueprint = (function () {
    function CoreBlueprint(blueprint, options) {
        var listFormsDir = path.join(options.metadataDir, "list-forms");
        var listForms = fs.readdirSync(listFormsDir);
        var editFormsDir = path.join(options.metadataDir, "edit-forms");
        var editForms = fs.readdirSync(editFormsDir);
        var modelsDir = path.join(options.metadataDir, "models");
        var models = fs.readdirSync(modelsDir);
        var children = [];
        var routes = [];
        var importProperties = [];
        var formsImportedProperties = [];
        var modelsImportedProperties = [];
        for (var _i = 0, listForms_1 = listForms; _i < listForms_1.length; _i++) {
            var formFileName = listForms_1[_i];
            var listFormFile = path.join(listFormsDir, formFileName);
            var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
            var listForm = JSON.parse(content);
            var listFormName = path.parse(formFileName).name;
            children.push("          {\n            link: '" + listFormName + "',\n            title: '" + listForm.caption + "',\n            children: null\n          }");
            routes.push("  this.route('" + listFormName + "');");
            routes.push("  this.route('" + listForm.editForm + "', { path: '" + listForm.editForm + "/:id' });");
            routes.push("  this.route('" + listForm.newForm + ".new', { path: '" + listForm.newForm + "/new' });");
            importProperties.push("import " + listForm.name + "Form from 'forms/" + listFormName + "';");
            formsImportedProperties.push("    '" + listFormName + "': " + listForm.name + "Form");
        }
        for (var _a = 0, editForms_1 = editForms; _a < editForms_1.length; _a++) {
            var formFileName = editForms_1[_a];
            var editFormFile = path.join(editFormsDir, formFileName);
            var content = stripBom(fs.readFileSync(editFormFile, "utf8"));
            var editForm = JSON.parse(content);
            var editFormName = path.parse(formFileName).name;
            importProperties.push("import " + editForm.name + "Form from 'forms/" + editFormName + "';");
            formsImportedProperties.push("    '" + editFormName + "': " + editForm.name + "Form");
        }
        for (var _b = 0, models_1 = models; _b < models_1.length; _b++) {
            var modelFileName = models_1[_b];
            var modelFile = path.join(modelsDir, modelFileName);
            var content = stripBom(fs.readFileSync(modelFile, "utf8"));
            var model = JSON.parse(content);
            var modelName = path.parse(modelFileName).name;
            importProperties.push("import " + model.name + "Model from 'models/" + modelName + "';");
            modelsImportedProperties.push("    '" + modelName + "': " + model.name + "Model");
        }
        this.children = children.join(",\n");
        this.routes = routes.join("\n");
        this.importProperties = importProperties.join("\n");
        this.formsImportedProperties = formsImportedProperties.join(",\n");
        this.modelsImportedProperties = modelsImportedProperties.join(",\n");
    }
    return CoreBlueprint;
}());
//# sourceMappingURL=index.js.map