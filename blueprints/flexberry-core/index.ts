/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

const stripBom = require("strip-bom");
import fs = require("fs");
import path = require('path');
import metadata = require('MetadataClasses');

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
    let coreBlueprint = new CoreBlueprint(this, options);
    return {
      children: coreBlueprint.children,// for use in files\__root__\controllers\application.js
      routes: coreBlueprint.routes// for use in files\__root__\router.js
    };
  }
};

class CoreBlueprint {

  children: string;
  routes: string;
  constructor(blueprint, options) {
    let listFormsDir = path.join(options.metadataDir, "list-forms");
    let listForms = fs.readdirSync(listFormsDir);
    let children = [];
    let routes = [];
    for (let form of listForms) {
      let listFormFile = path.join(listFormsDir, form);
      let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
      let listForm: metadata.ListForm = JSON.parse(content);
      let listFormName = path.parse(form).name;
      children.push(`          {\n            link: '${listFormName}',\n            title: '${listForm.caption}',\n            children: null\n          }`);
      routes.push(`  this.route('${listFormName}');`);
      routes.push(`  this.route('${listForm.editForm}', { path: '${listForm.editForm}/:id' });`);
      routes.push(`  this.route('${listForm.newForm}.new', { path: '${listForm.newForm}/new' });`);
    }
    this.children = children.join(",\n");
    this.routes = routes.join("\n");
  }
}
