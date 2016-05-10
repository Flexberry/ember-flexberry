﻿/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />

let stripBom = require("strip-bom");
import fs = require("fs");
import path = require('path');
import lodash = require('lodash');
let template = lodash.template;


module.exports = {
  description: 'Generates an ember application for flexberry.',

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
    let applicationBlueprint = new ApplicationBlueprint(this, options);
    return {
      children: applicationBlueprint.children,// for use in files\__root__\controllers\application.js
      routes: applicationBlueprint.routes// for use in files\__root__\router.js
    };
  }
};

class ApplicationBlueprint {
  children: any;
  routes: any;
  constructor(blueprint, options) {
    let listFormsDir = path.join(options.metadataDir, "list-forms");
    let listForms = fs.readdirSync(listFormsDir);
    let children = [];
    let routes = [];
    for (let form of listForms) {
      let listFormFile = path.join(listFormsDir, form);
      let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
      let listForm = JSON.parse(content);
      let listFormName = path.parse(form).name;
      children.push(`  {\n  link: '${listFormName}',\n  title: '${listForm.caption}',\n  children: null\n  }`);
      routes.push(`this.route('${listFormName}');`);
      routes.push(`this.route('${listForm.editForm}', { path: '${listForm.editForm}/:id' });`);
      routes.push(`this.route('${listForm.newForm}.new', { path: '${listForm.newForm}/new' });`);
    }
    this.children = children.join(",\n");
    this.routes = routes.join("\n");
  }
}
