/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
const fs = require("fs");
const path = require('path');
const stripBom = require("strip-bom");
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
        let listFormBlueprint = new ListFormBlueprint(this, options);
        return {
            editForm: listFormBlueprint.listForm.editForm,
            formName: listFormBlueprint.listForm.name,
            modelName: listFormBlueprint.listForm.projections[0].modelName,
            modelProjection: listFormBlueprint.listForm.projections[0].modelProjection,
            caption: listFormBlueprint.listForm.caption // for use in files\__root__\templates\__name__.hbs
        };
    }
};
class ListFormBlueprint {
    constructor(blueprint, options) {
        let listFormsDir = path.join(options.metadataDir, "list-forms");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        let listFormFile = path.join(listFormsDir, options.file);
        let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
        this.listForm = JSON.parse(content);
    }
}
//# sourceMappingURL=index.js.map