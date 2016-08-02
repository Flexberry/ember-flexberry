/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
var fs = require("fs");
var path = require('path');
var lodash = require('lodash');
var stripBom = require("strip-bom");
var Locales_1 = require('../flexberry-core/Locales');
module.exports = {
    description: 'Generates an ember list-form for flexberry.',
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
        var listFormBlueprint = new ListFormBlueprint(this, options);
        return lodash.defaults({
            editForm: listFormBlueprint.listForm.editForm,
            formName: listFormBlueprint.listForm.name,
            modelName: listFormBlueprint.listForm.projections[0].modelName,
            modelProjection: listFormBlueprint.listForm.projections[0].modelProjection,
            caption: listFormBlueprint.listForm.caption // for use in files\__root__\templates\__name__.hbs
        }, listFormBlueprint.locales.getLodashVariables() // for use in files\__root__\locales\**\forms\__name__.js
        );
    }
};
var ListFormBlueprint = (function () {
    function ListFormBlueprint(blueprint, options) {
        var listFormsDir = path.join(options.metadataDir, "list-forms");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        this.locales = new Locales_1.default(options.entity.name, "ru");
        var listFormFile = path.join(listFormsDir, options.file);
        var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
        this.listForm = JSON.parse(content);
        this.locales.setupForm(this.listForm);
    }
    return ListFormBlueprint;
}());
//# sourceMappingURL=index.js.map