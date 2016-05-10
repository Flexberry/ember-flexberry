/// <reference path='../typings/node/node.d.ts' />
var fs = require("fs");
var path = require('path');
var stripBom = require("strip-bom");
module.exports = {
    description: 'Generates an ember list-form for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String }
    ],
    locals: function (options) {
        var listFormBlueprint = new ListFormBlueprint(this, options);
        return {
            editForm: listFormBlueprint.listForm.editForm,
            formName: listFormBlueprint.listForm.name,
            modelName: listFormBlueprint.listForm.projections[0].modelName,
            modelProjection: listFormBlueprint.listForm.projections[0].modelProjection,
            caption: listFormBlueprint.listForm.caption // for use in files\__root__\templates\__name__.hbs
        };
    }
};
var ListFormBlueprint = (function () {
    function ListFormBlueprint(blueprint, options) {
        var listFormsDir = path.join(options.metadataDir, "list-forms");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        var listFormFile = path.join(listFormsDir, options.file);
        var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
        this.listForm = JSON.parse(content);
    }
    return ListFormBlueprint;
})();
//# sourceMappingURL=index.js.map