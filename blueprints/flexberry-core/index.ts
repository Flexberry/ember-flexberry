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
      routes: coreBlueprint.routes,// for use in files\__root__\router.js
      importProperties: coreBlueprint.importProperties,// for use in files\__root__\locales\**\translations.js
      formsImportedProperties: coreBlueprint.formsImportedProperties,// for use in files\__root__\locales\**\translations.js
      modelsImportedProperties: coreBlueprint.modelsImportedProperties// for use in files\__root__\locales\**\translations.js
    };
  }
};

class CoreBlueprint {

  children: string;
  routes: string;
  importProperties: string;
  formsImportedProperties: string;
  modelsImportedProperties: string;
  constructor(blueprint, options) {
    let listFormsDir = path.join(options.metadataDir, "list-forms");
    let listForms = fs.readdirSync(listFormsDir);
    let editFormsDir = path.join(options.metadataDir, "edit-forms");
    let editForms = fs.readdirSync(editFormsDir);
    let modelsDir = path.join(options.metadataDir, "models");
    let models = fs.readdirSync(modelsDir);
    let sitemapFile = path.join(options.metadataDir, "application", "sitemap.json");
    let children = [];
    let routes = [];
    let importProperties = [];
    let formsImportedProperties = [];
    let modelsImportedProperties = [];
    for (let formFileName of listForms) {
      let listFormFile = path.join(listFormsDir, formFileName);
      let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
      let listForm: metadata.ListForm = JSON.parse(content);
      let listFormName = path.parse(formFileName).name;
      children.push(`          {\n            link: '${listFormName}',\n            title: '${listForm.caption}',\n            children: null\n          }`);
      routes.push(`  this.route('${listFormName}');`);
      routes.push(`  this.route('${listForm.editForm}', { path: '${listForm.editForm}/:id' });`);
      routes.push(`  this.route('${listForm.newForm}.new', { path: '${listForm.newForm}/new' });`);
      importProperties.push(`import ${listForm.name}Form from 'forms/${listFormName}';`);
      formsImportedProperties.push(`    '${listFormName}': ${listForm.name}Form`);
    }
    for (let formFileName of editForms) {
      let editFormFile = path.join(editFormsDir, formFileName);
      let content = stripBom(fs.readFileSync(editFormFile, "utf8"));
      let editForm: metadata.EditForm = JSON.parse(content);
      let editFormName = path.parse(formFileName).name;
      importProperties.push(`import ${editForm.name}Form from 'forms/${editFormName}';`);
      formsImportedProperties.push(`    '${editFormName}': ${editForm.name}Form`);
    }
    for (let modelFileName of models) {
      let modelFile = path.join(modelsDir, modelFileName);
      let content = stripBom(fs.readFileSync(modelFile, "utf8"));
      let model: metadata.Model = JSON.parse(content);
      let modelName = path.parse(modelFileName).name;
      importProperties.push(`import ${model.name}Model from 'models/${modelName}';`);
      modelsImportedProperties.push(`    '${modelName}': ${model.name}Model`);
    }

    let sitemap: metadata.Sitemap = JSON.parse(stripBom(fs.readFileSync(sitemapFile, "utf8")));
    for (let item of sitemap.items) {
      let childItemExt = new SitemapItemExt(item, null);
      childItemExt.process();
    }

    this.children = children.join(",\n");
    this.routes = routes.join("\n");
    this.importProperties = importProperties.join("\n");
    this.formsImportedProperties = formsImportedProperties.join(",\n");
    this.modelsImportedProperties = modelsImportedProperties.join(",\n");
  }

}


class SitemapItemExt{
  translation: string;
  sitemap: string;
  baseItem: metadata.SitemapItem;
  parentItem: SitemapItemExt;
  constructor(baseItem: metadata.SitemapItem, parentItem: SitemapItemExt) {
    this.baseItem = baseItem;
    this.parentItem = parentItem;
  }
  process() {
    let level = 1;
    let parentItem = this.parentItem;
    let prefix = "forms.application.sitemap.application";
    while (parentItem) {
      prefix = `${prefix}.`
      level++;
    }
    for (let childItem of this.baseItem.children) {
      let childItemExt = new SitemapItemExt(childItem, this);
      childItemExt.process();
    }
    //if (this.)
  }
}
