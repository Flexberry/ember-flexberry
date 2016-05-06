/*jshint node:true*/
var fs = require("fs");
var stripBom = require("strip-bom");
var path = require('path');

module.exports = {
  description: 'Generates an ember list-form for flexberry.',

  availableOptions: [
    { name: 'file', type: String },
    { name: 'metadata-dir', type: String }
  ],

  locals: function (options) {
    var listFormsDir = path.join(options.metadataDir, "list-forms");
    if (!options.file) {
      options.file = options.entity.name + ".json";
    }
    var listFormFile = path.join(listFormsDir, options.file);
    var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
    var listForm = JSON.parse(content);

    return {
      formName: listForm.name,// for use in files\__root__\controllers\__name__.js
      modelName: listForm.projections[0].modelName,// for use in files\__root__\templates\__name__.hbs, files\__root__\routes\__name__.js
      modelProjection: listForm.projections[0].modelProjection,// for use in files\__root__\routes\__name__.js
      caption: listForm.caption// for use in files\__root__\templates\__name__.hbs
    };
  }
};
