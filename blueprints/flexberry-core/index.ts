/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

const stripBom = require("strip-bom");
import fs = require("fs");
import path = require('path');
import lodash = require('lodash');
import metadata = require('MetadataClasses');
import { ApplicationMenuLocales } from '../flexberry-core/Locales';
const TAB = "  ";

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
    let projectTypeNameCamel = "App";
    let projectTypeNameCebab = "app";
    if( options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon" ) {
      options.dummy = true;
      projectTypeNameCamel = "Addon";
      projectTypeNameCebab = "addon";
    }

    let coreBlueprint = new CoreBlueprint(this, options);
    return lodash.defaults({
      children: coreBlueprint.children,// for use in files\__root__\controllers\application.js
      routes: coreBlueprint.routes,// for use in files\__root__\router.js
      importProperties: coreBlueprint.importProperties,// for use in files\__root__\locales\**\translations.js
      formsImportedProperties: coreBlueprint.formsImportedProperties,// for use in files\__root__\locales\**\translations.js
      modelsImportedProperties: coreBlueprint.modelsImportedProperties,// for use in files\__root__\locales\**\translations.js
      applicationCaption: coreBlueprint.sitemap.applicationCaption,// for use in files\__root__\locales\**\translations.js
      applicationTitle: coreBlueprint.sitemap.applicationTitle,// for use in files\__root__\locales\**\translations.js
      inflectorIrregular: coreBlueprint.inflectorIrregular,// for use in files\__root__\models\custom-inflector-rules.js
      projectTypeNameCamel: projectTypeNameCamel,// for use in files\ember-cli-build.js
      projectTypeNameCebab: projectTypeNameCebab// for use in files\ember-cli-build.js
      },
      coreBlueprint.lodashVariablesApplicationMenu// for use in files\__root__\locales\**\translations.js
    );
  }
};

class CoreBlueprint {

  children: string;
  routes: string;
  importProperties: string;
  formsImportedProperties: string;
  modelsImportedProperties: string;
  lodashVariablesApplicationMenu: {};
  sitemap: metadata.Sitemap;
  inflectorIrregular: string;

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
    let inflectorIrregular = [];
    for (let formFileName of listForms) {
      let listFormFile = path.join(listFormsDir, formFileName);
      let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
      let listForm: metadata.ListForm = JSON.parse(content);
      let listFormName = path.parse(formFileName).name;
      routes.push(`  this.route('${listFormName}');`);
      routes.push(`  this.route('${listForm.editForm}', { path: '${listForm.editForm}/:id' });`);
      routes.push(`  this.route('${listForm.newForm}.new', { path: '${listForm.newForm}/new' });`);
      importProperties.push(`import ${listForm.name}Form from './forms/${listFormName}';`);
      formsImportedProperties.push(`    '${listFormName}': ${listForm.name}Form`);
    }
    for (let formFileName of editForms) {
      let editFormFile = path.join(editFormsDir, formFileName);
      let content = stripBom(fs.readFileSync(editFormFile, "utf8"));
      let editForm: metadata.EditForm = JSON.parse(content);
      let editFormName = path.parse(formFileName).name;
      importProperties.push(`import ${editForm.name}Form from './forms/${editFormName}';`);
      formsImportedProperties.push(`    '${editFormName}': ${editForm.name}Form`);
    }
    for (let modelFileName of models) {
      let modelFile = path.join(modelsDir, modelFileName);
      let content = stripBom(fs.readFileSync(modelFile, "utf8"));
      let model: metadata.Model = JSON.parse(content);
      let modelName = path.parse(modelFileName).name;
      let LAST_WORD_CAMELIZED_REGEX = /([\w/\s-]*)([A-Z][a-z\d]*$)/;
      let irregularLastWordOfModelName = LAST_WORD_CAMELIZED_REGEX.exec(model.name)[2].toLowerCase();
      importProperties.push(`import ${model.name}Model from './models/${modelName}';`);
      modelsImportedProperties.push(`    '${modelName}': ${model.name}Model`);
      inflectorIrregular.push(`inflector.irregular('${irregularLastWordOfModelName}', '${irregularLastWordOfModelName}s');`);
    }

    this.sitemap = JSON.parse(stripBom(fs.readFileSync(sitemapFile, "utf8")));
    let applicationMenuLocales = new ApplicationMenuLocales("ru");
    for (let item of this.sitemap.items) {
      let childItemExt = new SitemapItemExt(item);
      childItemExt.process("forms.application.sitemap", 5);
      applicationMenuLocales.push(childItemExt.translation, childItemExt.translationOtherLocales);
      children.push(childItemExt.sitemap);
    }
    this.lodashVariablesApplicationMenu = applicationMenuLocales.getLodashVariablesWithSuffix("ApplicationMenu");

    this.children = children.join(", ");
    this.routes = routes.join("\n");
    this.importProperties = importProperties.join("\n");
    this.formsImportedProperties = formsImportedProperties.join(",\n");
    this.modelsImportedProperties = modelsImportedProperties.join(",\n");
    this.inflectorIrregular = inflectorIrregular.join("\n");
  }

}


class SitemapItemExt{
  translation: string;
  translationOtherLocales: string;
  sitemap: string;
  baseItem: metadata.SitemapItem;
  constructor(baseItem: metadata.SitemapItem) {
    this.baseItem = baseItem;
  }
  process(parentTranslationProp: string, level: number) {
    let translationProp: string
    let translationName: string
    if (this.baseItem.menuName) {
      translationName = this.baseItem.menuName;
    } else {
      translationName = this.baseItem.link;
    }
    translationProp = `${parentTranslationProp}.${translationName}`;
    let childrenTranslation = [];
    let childrenTranslationOtherLocales = [];
    let sitemap = [];
    if (this.baseItem.children) {
      for (let childItem of this.baseItem.children) {
        let childItemExt = new SitemapItemExt(childItem);
        childItemExt.process(translationProp, level + 1);
        childrenTranslation.push(childItemExt.translation);
        childrenTranslationOtherLocales.push(childItemExt.translationOtherLocales);
        sitemap.push(childItemExt.sitemap);
      }
    }
    let indent: string[] = [];
    for (let i = 0; i < level; i++) {
      indent.push(TAB);
    }
    let indentStr = indent.join("");
    indent.pop();
    let indentStr2 = indent.join("");
    let childrenStr = "";
    let sitemapChildrenStr = "null";
    let childrenOtherLocalesStr = "";
    if (childrenTranslation.length>0) {
      childrenStr = childrenTranslation.join(",\n");
      childrenOtherLocalesStr = childrenTranslationOtherLocales.join(",\n");
      sitemapChildrenStr = `[${sitemap.join(", ")}]`;
    }
    this.translation = `${indentStr2}${this.quote(translationName)}: {\n${indentStr}caption: '${this.escapeValue(this.baseItem.caption)}',\n` +
      `${indentStr}title: '${this.escapeValue(this.baseItem.title)}',\n${childrenStr}\n${indentStr2}}`;
    this.translationOtherLocales = `${indentStr2}${this.quote(translationName)}: {\n${indentStr}caption: '${this.escapeValue(translationName)}',\n` +
      `${indentStr}title: '${this.escapeValue(translationName)}',\n${childrenOtherLocalesStr}\n${indentStr2}}`;

    const INDENT = "";
    this.sitemap = `{\n${INDENT}${indentStr}link: ${this.quoteIfNotNull(this.baseItem.link)},\n` +
      `${INDENT}${indentStr}caption: i18n.t('${translationProp}.caption'),\n` +
      `${INDENT}${indentStr}title: i18n.t('${translationProp}.title'),\n` +
      `${INDENT}${indentStr}children: ${sitemapChildrenStr}\n${INDENT}${indentStr2}}`;
  }

  escapeValue(value: string) {
    return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }

  quote(propName: string) {
    if (propName.indexOf("-") == -1)
      return propName;
    return `'${propName}'`;
  }

  quoteIfNotNull(str: string) {
    if (str)
      return `'${str}'`;
    return "null";
  }
}
