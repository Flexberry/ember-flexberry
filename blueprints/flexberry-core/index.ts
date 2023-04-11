/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

const stripBom = require("strip-bom");
import fs = require("fs");
import path = require('path');
import lodash = require('lodash');
import metadata = require('MetadataClasses');
import { ApplicationMenuLocales } from '../flexberry-core/Locales';
import ModelBlueprint from '../flexberry-model/ModelBlueprint';
import CommonUtils from '../flexberry-common/CommonUtils';
const TAB = "  ";
const skipConfirmationFunc = require('../utils/skip-confirmation');

module.exports = {
  description: 'Generates core entities for flexberry.',

  availableOptions: [
    { name: 'metadata-dir', type: String },
    { name: 'skip-confirmation', type: Boolean }
  ],

  supportsAddon: function () {
    return false;
  },

  _files: null,

  _generateOnce: [
    '.jscsrc',

    //'__root__/app.js',
    //'__root__/templates/application.hbs',

    '__root__/templates/mobile/application.hbs',
  ],

  getFileMap: function() {
    let moduleName = this.options.entity && this.options.entity.name || this.packageName;
    let fileMapVariables = this._generateFileMapVariables(moduleName, null, this.options);
    return this.generateFileMap(fileMapVariables)
  },

  getTargetFile: function(file: string, fileMap = null): string {
    if (!fileMap) {
      fileMap = this.getFileMap();
    }
    let targetFile = String(file);
    for (let i of lodash.keys(fileMap)) {
      let pattern = new RegExp(i, 'g');
      targetFile = targetFile.replace(pattern, fileMap[i]);
    }
    return targetFile;
  },

  isDummy: false,

  files: function () {
    if (this._files) { return this._files; }
    this.isDummy = this.options.dummy;
    let sitemapFile = path.join(this.options.metadataDir, "application", "sitemap.json");
    let sitemap: metadata.Sitemap = JSON.parse(stripBom(fs.readFileSync(sitemapFile, "utf8")));
    if (this.project.isEmberCLIAddon() && !this.options.dummy) {
      if (sitemap.mobile) {
        this._files = CommonUtils.getFilesForGeneration(this, function (v) { return v === "__root__/locales/en/translations.js" || v === "__root__/locales/ru/translations.js"; });
      } else {
        this._files = CommonUtils.getFilesForGeneration(this, function (v) { return v === "__root__/templates/mobile/application.hbs" || v === "__root__/locales/en/translations.js" || v === "__root__/locales/ru/translations.js"; });
      }
    } else {
      if (sitemap.mobile) {
          this._files = CommonUtils.getFilesForGeneration(this, function (v) { return v === "addon/locales/en/translations.js" || v === "addon/locales/ru/translations.js"; });
      } else {
          this._files = CommonUtils.getFilesForGeneration(this, function (v) { return v === "__root__/templates/mobile/application.hbs" || v === "addon/locales/en/translations.js" || v === "addon/locales/ru/translations.js"; });
      }
    }
    if (this.project.isEmberCLIAddon() || this.options.dummy) {
        lodash.remove(this._files, function (v) { return v === "public/assets/images/cat.gif" || v === "public/assets/images/favicon.ico" || v === "public/assets/images/flexberry-logo.png"; });
    } else {
        lodash.remove(this._files, function (fileName: string) { return fileName.indexOf("tests/dummy/") === 0; });
    }
    this._excludeIfExists();
    return this._files;
  },

  processFiles(intoDir, templateVariables) {
    let skipConfirmation = this.options.skipConfirmation;
    if (skipConfirmation) {
      return skipConfirmationFunc(this, intoDir, templateVariables);
    }

    return this._super(...arguments);
  },

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
    if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
      options.dummy = true;
      projectTypeNameCamel = "Addon";
      projectTypeNameCebab = "addon";
    }

    let coreBlueprint = new CoreBlueprint(this, options);
    return lodash.defaults({
      projectName: this.project.pkg.name,// for use in files\tests\dummy\app\locales\**\translations.js
      children: coreBlueprint.children,// for use in files\__root__\controllers\application.js
      routes: coreBlueprint.routes,// for use in files\__root__\router.js
      importProperties: coreBlueprint.importProperties,// for use in files\__root__\locales\**\translations.js
      formsImportedProperties: coreBlueprint.formsImportedProperties,// for use in files\__root__\locales\**\translations.js
      modelsImportedProperties: coreBlueprint.modelsImportedProperties,// for use in files\__root__\locales\**\translations.js
      applicationCaption: coreBlueprint.sitemap.applicationCaption,// for use in files\__root__\locales\**\translations.js
      applicationTitle: coreBlueprint.sitemap.applicationTitle,// for use in files\__root__\locales\**\translations.js
      projectTypeNameCamel: projectTypeNameCamel,// for use in files\ember-cli-build.js
      projectTypeNameCebab: projectTypeNameCebab// for use in files\ember-cli-build.js
      },
      coreBlueprint.lodashVariablesApplicationMenu// for use in files\__root__\locales\**\translations.js
    );
  },

  _excludeIfExists: function () {
    let fileMap = this.getFileMap();
    let checkIfExists = lodash.intersection(this._files, this._generateOnce);
    for (let file of checkIfExists) {
      let targetFile = this.getTargetFile(file, fileMap);
      if (fs.existsSync(targetFile)) {
        lodash.remove(this._files, (v) => v === file);
      }
    }
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
      let pp: path.ParsedPath = path.parse(formFileName);
      if (pp.ext != ".json")
        continue;
      let listFormFile = path.join(listFormsDir, formFileName);
      let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
      let listForm: metadata.ListForm = JSON.parse(content);
      if (listForm.external)
        continue;
      let listFormName = pp.name;
      routes.push(`  this.route('${listFormName}');`);
      routes.push(`  this.route('${listForm.editForm}',\n  { path: '${listForm.editForm}/:id' });`);
      routes.push(`  this.route('${listForm.newForm}.new',\n  { path: '${listForm.newForm}/new' });`);
      importProperties.push(`import ${listForm.name}Form from './forms/${listFormName}';`);
      formsImportedProperties.push(`    '${listFormName}': ${listForm.name}Form`);
    }
    for (let formFileName of editForms) {
      let pp: path.ParsedPath = path.parse(formFileName);
      if (pp.ext != ".json")
        continue;
      let editFormFile = path.join(editFormsDir, formFileName);
      let content = stripBom(fs.readFileSync(editFormFile, "utf8"));
      let editForm: metadata.EditForm = JSON.parse(content);
      if (editForm.external)
        continue;
      let editFormName = pp.name;
      importProperties.push(`import ${editForm.name}Form from './forms/${editFormName}';`);
      formsImportedProperties.push(`    '${editFormName}': ${editForm.name}Form`);
    }
    for (let modelFileName of models) {
      let pp: path.ParsedPath = path.parse(modelFileName);
      if (pp.ext != ".json")
        continue;
      let model: metadata.Model = ModelBlueprint.loadModel(modelsDir, modelFileName);
      if (model.external)
        continue;
      let modelName = pp.name;
      importProperties.push(`import ${model.name}Model from './models/${modelName}';`);
      modelsImportedProperties.push(`    '${modelName}': ${model.name}Model`);
    }

    this.sitemap = JSON.parse(stripBom(fs.readFileSync(sitemapFile, "utf8")));
    let localePathTemplate: lodash.TemplateExecutor = this.getLocalePathTemplate(options, blueprint.isDummy, "translations.js");
    let applicationMenuLocales = new ApplicationMenuLocales("ru", localePathTemplate);
    for (let item of this.sitemap.items) {
      let childItemExt = new SitemapItemExt(item);
      childItemExt.process("forms.application.sitemap", 5);
      applicationMenuLocales.push(childItemExt.translation, childItemExt.translationOtherLocales);
      children.push(childItemExt.sitemap);
    }
    this.lodashVariablesApplicationMenu = applicationMenuLocales.getLodashVariablesWithSuffix("ApplicationMenu", 4);

    this.children = children.join(", ");
    this.routes = routes.join("\n");
    this.importProperties = importProperties.join("\n");
    this.formsImportedProperties = formsImportedProperties.join(",\n");
    this.modelsImportedProperties = modelsImportedProperties.join(",\n");
  }

  private getLocalePathTemplate(options, isDummy, localePathSuffix: string): lodash.TemplateExecutor {
    let targetRoot = "app"
    if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon" ) {
      targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
    }
    return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
  }
}

class SitemapItemExt {
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
      (level > 5 ? '' : `${INDENT}${indentStr}icon: 'list',\n`) +
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
