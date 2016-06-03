/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

import fs = require("fs");
import path = require('path');
const stripBom = require("strip-bom");
import metadata = require('MetadataClasses');

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
  locals: function(options) {
    let listFormBlueprint = new ListFormBlueprint(this, options);
    return {
      editForm: listFormBlueprint.listForm.editForm,// for use in files\__root__\templates\__name__.hbs
      formName: listFormBlueprint.listForm.name,// for use in files\__root__\controllers\__name__.js
      modelName: listFormBlueprint.listForm.projections[0].modelName,// for use in files\__root__\templates\__name__.hbs, files\__root__\routes\__name__.js
      modelProjection: listFormBlueprint.listForm.projections[0].modelProjection,// for use in files\__root__\routes\__name__.js
      caption: listFormBlueprint.listForm.caption// for use in files\__root__\templates\__name__.hbs
    };
  }
};

class ListFormBlueprint {
  listForm: metadata.ListForm;
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
