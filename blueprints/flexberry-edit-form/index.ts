/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

const stripBom = require("strip-bom");
const skipConfirmationFunc = require('../utils/skip-confirmation');
import fs = require("fs");
import path = require('path');
import lodash = require('lodash');
import metadata = require('MetadataClasses');
import Locales from '../flexberry-core/Locales';
import CommonUtils from '../flexberry-common/CommonUtils';
import ModelBlueprint from '../flexberry-model/ModelBlueprint';

const componentMaps = [
  { name: "flexberry-file", types: ["file"] },
  { name: "flexberry-checkbox", types: ["boolean"] },
  { name: "flexberry-simpledatetime", types: ["date"] },
  { name: "flexberry-field", types: ["string", "number", "decimal"] }
];

module.exports = {
  description: 'Generates an ember edit-form for flexberry.',

  availableOptions: [
    { name: 'file', type: String },
    { name: 'metadata-dir', type: String },
    { name: 'skip-confirmation', type: Boolean }
  ],

  supportsAddon: function () {
    return false;
  },

  _files: null,

  isDummy: false,

  files: function () {
    if (this._files) { return this._files; }
    this.isDummy = this.options.dummy;
    if (this.options.dummy) {
      this._files = CommonUtils.getFilesForGeneration(this, function (v) { return v === "app/templates/__name__.hbs"; });
    } else {
      this._files = CommonUtils.getFilesForGeneration(this, function (v) { return v === "tests/dummy/app/templates/__name__.hbs"; });
    }
    this.setLocales(this._files);
    return this._files;
  },

  afterInstall: function (options) {
    if (this.project.isEmberCLIAddon()) {
      CommonUtils.installFlexberryAddon(options, ["controller", "route"]);
      CommonUtils.installReexportNew(options, ["controller", "route"]);
    }
  },

  processFiles(intoDir, templateVariables) {
    let skipConfirmation = this.options.skipConfirmation;
    if (skipConfirmation) {
      return skipConfirmationFunc(this, intoDir, templateVariables);
    }

    return this._super(...arguments);
  },

  setLocales: function (files) {
    var localesFile = path.join('vendor/flexberry/custom-generator-options/generator-options.json');
    if (!fs.existsSync(localesFile)) {
        return files;
    };
    var locales = JSON.parse(stripBom(fs.readFileSync(localesFile, "utf8")));
    if (locales.locales == undefined) {
        return files;
    };
    if (!locales.locales.en) {
        files.splice(files.indexOf("__root__/locales/en/"), 1);
        files.splice(files.indexOf("__root__/locales/en/forms/"), 1);
        files.splice(files.indexOf("__root__/locales/en/forms/__name__.js"), 1);
    };
    if (!locales.locales.ru) {
        files.splice(files.indexOf("__root__/locales/ru/"), 1);
        files.splice(files.indexOf("__root__/locales/ru/forms/"), 1);
        files.splice(files.indexOf("__root__/locales/ru/forms/__name__.js"), 1);
    };
    return files;
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
    if (!options.file) {
      options.file = options.entity.name + ".json";
    }
    var editFormBlueprint = new EditFormBlueprint(this, options);
    return lodash.defaults({
      modelName: editFormBlueprint.editForm.projections[0].modelName,// for use in files\__root__\routes\__name__.js, files\__root__\routes\__name__\new.js
      modelProjection: editFormBlueprint.editForm.projections[0].modelProjection,// for use in files\__root__\routes\__name__.js, files\__root__\routes\__name__\new.js
      formName: editFormBlueprint.editForm.name,// for use in files\__root__\controllers\__name__\new.js
      entityName: options.entity.name,// for use in files\__root__\controllers\__name__\new.js
      caption: editFormBlueprint.editForm.caption,// for use in files\__root__\controllers\__name__.js
      parentRoute: editFormBlueprint.parentRoute,// for use in files\__root__\controllers\__name__.js
      flexberryComponents: editFormBlueprint.flexberryComponents,// for use in files\__root__\templates\__name__.hbs
      functionGetCellComponent: editFormBlueprint.functionGetCellComponent,// for use in files\__root__\controllers\__name__.js
      isEmberCpValidationsUsed: editFormBlueprint.isEmberCpValidationsUsed,
      },
      editFormBlueprint.locales.getLodashVariablesProperties()// for use in files\__root__\locales\**\forms\__name__.js
    );
  }
};

class EditFormBlueprint {
  locales: Locales;
  editForm: metadata.EditForm;
  parentRoute: string;
  flexberryComponents: string;
  functionGetCellComponent: string;
  isEmberCpValidationsUsed: boolean;

  private snippetsResult = [];
  private _tmpSnippetsResult = [];
  private modelsDir: string;
  private blueprint;
  private options;

  constructor(blueprint, options) {
    this.isEmberCpValidationsUsed = true;
    this.blueprint = blueprint;
    this.options = options;
    this.modelsDir = path.join(options.metadataDir, "models");
    let localePathTemplate: lodash.TemplateExecutor = this.getLocalePathTemplate(options, blueprint.isDummy, path.join("forms", options.entity.name + ".js"));
    this.locales = new Locales(options.entity.name, "ru", localePathTemplate);
    this.process();
    this.flexberryComponents = this.snippetsResult.join("\n");
    this.parentRoute = this.getParentRoute();
    let bodySwitchBindingPath: string[] = [];
    let propertyLookup: metadata.PropertyLookup;
    for (propertyLookup of this.editForm.propertyLookup) {
      if (!propertyLookup.master)
        continue;
      let snippet = this.readSnippetFile("getCellComponent-flexberry-lookup", "js");
      bodySwitchBindingPath.push(lodash.template(snippet)(propertyLookup));
    }
    if (bodySwitchBindingPath.length > 0) {
      let snippet = this.readSnippetFile("getCellComponent-function", "js");
      this.functionGetCellComponent = lodash.template(snippet)({ bodySwitchBindingPath: bodySwitchBindingPath.join("\n") });
      this.functionGetCellComponent = lodash.trimEnd(this.functionGetCellComponent, "\n");
    } else {
      this.functionGetCellComponent = null;
    }
  }

  readSnippetFile(fileName: string, fileExt: string): string {
    let snippetsFolder = this.isEmberCpValidationsUsed ? "ember-cp-validations" : "ember-validations";
    return stripBom(fs.readFileSync(path.join(this.blueprint.path, "snippets", snippetsFolder, fileName + "." + fileExt), "utf8"));
  }

  readHbsSnippetFile(componentName: string): string {
    return this.readSnippetFile(componentName, "hbs");
  }

  loadModel(modelName: string): metadata.Model {
    let model: metadata.Model = ModelBlueprint.loadModel(this.modelsDir, modelName + ".json");
    return model;
  }

  findAttr(model: metadata.Model, attrName: string){
    let modelAttr = lodash.find(model.attrs, function (attr) { return attr.name === attrName; });
    if (!modelAttr) {
      model = this.loadModel(model.parentModelName);
      return this.findAttr(model, attrName);
    }
    return modelAttr;
  }

  loadSnippet(model: metadata.Model, attrName: string): string {
    let modelAttr = this.findAttr(model,attrName);
    let component = lodash.find(componentMaps, function (map) { return lodash.indexOf(map.types, modelAttr.type) !== -1; });
    if (!component) {
      return this.readHbsSnippetFile("flexberry-dropdown");
    }
    return this.readHbsSnippetFile(component.name);
  }

  process() {
    let editFormsDir = path.join(this.options.metadataDir, "edit-forms");
    let editFormsFile = path.join(editFormsDir, this.options.file);
    let content: string = stripBom(fs.readFileSync(editFormsFile, "utf8"));
    this.editForm = JSON.parse(content);
    this.locales.setupForm(this.editForm);
    let linkProj = this.editForm.projections[0];
    let model = this.loadModel(linkProj.modelName);
    let proj = lodash.find(model.projections, function (pr) { return pr.name === linkProj.modelProjection; });
    let projAttr: any;
    for (projAttr of proj.attrs) {
      this.locales.setupEditFormAttribute(projAttr);
      if (projAttr.hidden || projAttr.index === -1) {
        continue;
      }
      let snippet = this.loadSnippet(model, projAttr.name);
      let attr = this.findAttr(model, projAttr.name);
      projAttr.readonly="readonly";
      projAttr.type = attr.type;
      projAttr.entityName = this.options.entity.name;
      projAttr.dashedName = (projAttr.name || '').replace(/\./g, '-');
      this.calculateValidatePropertyNames(projAttr);
      this._tmpSnippetsResult.push({ index: projAttr.index, snippetResult: lodash.template(snippet)(projAttr) });
    }
    this.fillBelongsToAttrs(proj.belongsTo, []);
    let belongsTo,hasMany: any;
    for (belongsTo of proj.belongsTo) {
      this.locales.setupEditFormAttribute(belongsTo);
      if (belongsTo.hidden || belongsTo.index === -1) {
        continue;
      }
      var propertyLookup = lodash.find(this.editForm.propertyLookup, function (propLookup) { return propLookup.relationName === belongsTo.relationName; });
      if (propertyLookup) {
        belongsTo.projection = propertyLookup.projection;
        belongsTo.readonly = "readonly";
        belongsTo.entityName = this.options.entity.name;
        belongsTo.dashedName = (belongsTo.name || '').replace(/\./g, '-');
        belongsTo.isDropdown = belongsTo.type === 'combo';
        this.calculateValidatePropertyNames(belongsTo);
        this._tmpSnippetsResult.push({ index: belongsTo.index, snippetResult: lodash.template(this.readHbsSnippetFile("flexberry-lookup"))(belongsTo) });
      }
    }
    this._tmpSnippetsResult = lodash.sortBy(this._tmpSnippetsResult, ["index"]);
    this.snippetsResult = lodash.map(this._tmpSnippetsResult, "snippetResult");
    for (hasMany of proj.hasMany) {
      hasMany.readonly = "readonly";
      hasMany.entityName = this.options.entity.name;
      hasMany.dashedName = (hasMany.name || '').replace(/\./g, '-');
      this.locales.setupEditFormAttribute(hasMany);
      this.calculateValidatePropertyNames(hasMany);
      this.snippetsResult.push(lodash.template(this.readHbsSnippetFile("flexberry-groupedit"))(hasMany));
    }
  }

  fillBelongsToAttrs(belongsToArray: metadata.ProjBelongsTo[], parentPath: string[]) {
    for (let belongsTo of belongsToArray) {
      let currentPath = lodash.concat(parentPath, belongsTo.name);
      let belongsToAttr: any;
      for (belongsToAttr of belongsTo.attrs) {
        if (belongsToAttr.hidden || belongsToAttr.index === -1) {
          continue;
        }
        let model = this.loadModel(belongsTo.relatedTo);
        let snippet = this.loadSnippet(model, belongsToAttr.name);
        let attr = this.findAttr(model, belongsToAttr.name);
        belongsToAttr.name = lodash.concat(currentPath, belongsToAttr.name).join(".");
        belongsToAttr.readonly="true";
        belongsToAttr.type=attr.type;
        belongsToAttr.entityName = this.options.entity.name;
        belongsToAttr.dashedName = (belongsToAttr.name || '').replace(/\./g, '-');
        this.locales.setupEditFormAttribute(belongsToAttr);
        this.calculateValidatePropertyNames(belongsToAttr);
        this._tmpSnippetsResult.push({ index: belongsToAttr.index, snippetResult: lodash.template(snippet)(belongsToAttr) });
      }
      this.fillBelongsToAttrs(belongsTo.belongsTo, currentPath);
    }
  }

  getParentRoute() {
    let parentRoute = '';
    let listFormsDir = path.join(this.options.metadataDir, "list-forms");
    let listForms = fs.readdirSync(listFormsDir);
    for (let form of listForms) {
      let pp: path.ParsedPath = path.parse(form);
      if (pp.ext != ".json")
        continue;
      let listFormFile = path.join(listFormsDir, form);
      let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
      let listForm: metadata.ListForm = JSON.parse(content);
      if (this.options.entity.name === listForm.editForm) {
        parentRoute = pp.name;
      }
    }
    return parentRoute;
  }

  private getLocalePathTemplate(options, isDummy, localePathSuffix: string): lodash.TemplateExecutor {
    let targetRoot = "app"
    if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon" ) {
      targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
    }
    return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
  }

  private calculateValidatePropertyNames(attrs) {
    const name = attrs.name;
    const lastDotIndex = name.lastIndexOf(".");
    const isHaveMaster = lastDotIndex > 0 && lastDotIndex < (name.length - 1);

    attrs.propertyMaster = (isHaveMaster) ? "." + name.substring(0, lastDotIndex) : "";
    attrs.propertyName = (isHaveMaster) ? name.substring(lastDotIndex + 1, name.length) : name;
  }
}
