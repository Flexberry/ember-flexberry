/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

const stripBom = require("strip-bom");
import fs = require("fs");
import path = require('path');
import lodash = require('lodash');
import metadata = require('MetadataClasses');
import { ModelLocales } from '../flexberry-core/Locales';

const TAB = "  ";

class SortedPair{
  index: number;
  str: string;

  constructor(index: number, str: string) {
    this.index=index;
    this.str=str;
  }
}

export default class ModelBlueprint {
  model: string;
  serializerAttrs: string;
  offlineSerializerAttrs: string;
  parentModelName: string;
  parentClassName: string;
  parentExternal: boolean;
  className: string;
  namespace: string;
  projections: string;
  validations: string;
  name: string;
  needsAllModels: string;
  needsAllEnums: string;
  needsAllObjects: string;
  lodashVariables: {};
  enums: { [key: string]: metadata.Enumeration; };
  enumImports: { [key: string]: string; } = {};

  constructor(blueprint, options) {
    let modelsDir = path.join(options.metadataDir, "models");
    if (!options.file) {
      options.file = options.entity.name + ".json";
    }
    let model: metadata.Model = ModelBlueprint.loadModel(modelsDir, options.file);
    this.parentModelName = model.parentModelName;
    this.parentClassName = model.parentClassName;
    if (model.parentModelName) {
      let parentModel: metadata.Model = ModelBlueprint.loadModel(modelsDir, model.parentModelName + ".json");
      this.parentExternal = parentModel.external;
    }
    this.enums = ModelBlueprint.loadEnums(options.metadataDir);
    this.className = model.className;
    this.namespace = model.nameSpace;
    this.serializerAttrs = this.getSerializerAttrs(model);
    this.offlineSerializerAttrs = this.getOfflineSerializerAttrs(model);
    this.projections = this.getJSForProjections(model, modelsDir);
    this.model = this.getJSForModel(model);
    this.name = options.entity.name;
    this.needsAllModels = this.getNeedsAllModels(modelsDir);
    this.needsAllEnums = this.getNeedsTransforms(path.join(options.metadataDir, "enums"));
    this.needsAllObjects = this.getNeedsTransforms(path.join(options.metadataDir, "objects"));
    let localePathTemplate: lodash.TemplateExecutor = this.getLocalePathTemplate(options, blueprint.isDummy, path.join("models", options.entity.name + ".js"));
    let modelLocales = new ModelLocales(model, modelsDir, "ru", localePathTemplate);
    this.lodashVariables = modelLocales.getLodashVariablesProperties();
    this.validations = this.getValidations(model);
  }

  static loadModel(modelsDir: string, modelFileName: string): metadata.Model {
    let modelFile = path.join(modelsDir, modelFileName);
    let content = stripBom(fs.readFileSync(modelFile, "utf8"));
    let model: metadata.Model = JSON.parse(content);
    return model;
  }

  static loadEnums(metadataDir: string): { [key: string]: metadata.Enumeration; } {
    let enums: { [key: string]: metadata.Enumeration; } = {};
    let enumsDir: string = path.join(metadataDir, "enums");
    let files = fs.readdirSync(enumsDir);
    for (let fileName of files) {
      let parsedPath: path.ParsedPath = path.parse(fileName);
      if (parsedPath.ext === ".json") {
        let enumContent = fs.readFileSync(path.join(enumsDir, fileName), "utf8");
        enums[parsedPath.name] = JSON.parse(stripBom(enumContent));
      }
    }

    return enums;
  }

  getNeedsTransforms(dir: string): string {
    let list = fs.readdirSync(dir);
    let transforms: string[] = [];
    for (let e of list) {
      let pp: path.ParsedPath = path.parse(e);
      if (pp.ext != ".json")
        continue;
      transforms.push(`    'transform:${pp.name}'`);
    }
    return transforms.join(",\n");
  }

  getNeedsAllModels(modelsDir: string): string {
    let listModels = fs.readdirSync(modelsDir);
    let models: string[] = [];
    for (let model of listModels) {
      let pp: path.ParsedPath = path.parse(model);
      if (pp.ext != ".json")
        continue;
      models.push(`    'model:${pp.name}'`);
    }
    return models.join(",\n");
  }

  getSerializerAttrs(model: metadata.Model): string {
    let attrs: string[] = [];
    for (let belongsTo of model.belongsTo) {
      attrs.push(belongsTo.name + ": { serialize: 'odata-id', deserialize: 'records' }");
    }
    for (let hasMany of model.hasMany) {
      attrs.push(hasMany.name + ": { serialize: false, deserialize: 'records' }");
    }
    if(attrs.length===0){
      return "";
    }
    return "      "+attrs.join(",\n      ");
  }

  getOfflineSerializerAttrs(model: metadata.Model): string {
    let attrs: string[] = [];
    for (let belongsTo of model.belongsTo) {
      attrs.push(belongsTo.name + ": { serialize: 'id', deserialize: 'records' }");
    }
    for (let hasMany of model.hasMany) {
      attrs.push(hasMany.name + ": { serialize: 'ids', deserialize: 'records' }");
    }
    if (attrs.length === 0) {
      return "";
    }
    return "      " + attrs.join(",\n      ");
  }

  getJSForModel(model: metadata.Model): string {
    let attrs: string[] = [];
    let templateBelongsTo = lodash.template("<%=name%>: DS.belongsTo('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false<%if(polymorphic){%>, polymorphic: true<%}%> })");
    let templateHasMany = lodash.template("<%=name%>: DS.hasMany('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false })");
    let attr: metadata.DSattr;
    for (attr of model.attrs) {
      let comment = "";
      if (!attr.stored) {
        comment =
          "/**\n" +
          TAB + TAB + "Non-stored property.\n\n" +
          TAB + TAB + `@property ${attr.name}\n` +
          TAB + "*/\n" + TAB;
      }
      var options = [];
      var optionsStr = "";
      if (attr.defaultValue) {
        switch (attr.type) {
          case 'decimal':
          case 'number':
          case 'boolean':
            options.push(`defaultValue: ${attr.defaultValue}`);
            break;
          case 'date':
            if (attr.defaultValue === 'Now') {
              options.push(`defaultValue() { return new Date(); }`);
              break;
            }
            break;
          default:
            if (this.enums.hasOwnProperty(attr.type)) {
              let enumName = `${this.enums[attr.type].className}Enum`;
              this.enumImports[enumName] = attr.type;
              options.push(`defaultValue: ${enumName}.${attr.defaultValue}`);
            } else {
              options.push(`defaultValue: '${attr.defaultValue}'`);
            }
        }
      }
      if (attr.ordered) {
          options.push("ordered: true");
      }
      if (options.length != 0) {
          optionsStr = ", { " + options.join(', ') + ' }';
      }
      attrs.push(`${comment}${attr.name}: DS.attr('${attr.type}'${optionsStr})`);
      if (attr.notNull) {
        if (attr.type === "date") {
          validations.push(attr.name + ": { datetime: true }");
        } else {
          validations.push(attr.name + ": { presence: true }");
        }
      }
      if (attr.stored)
        continue;
      let methodToSetNotStoredProperty =
        "/**\n" +
        TAB + TAB + "Method to set non-stored property.\n" +
        TAB + TAB + "Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.\n" +
        TAB + TAB + `Please, implement '${attr.name}Compute' method in model class (outside of this mixin) if you want to compute value of '${attr.name}' property.\n\n` +
        TAB + TAB + `@method _${attr.name}Compute\n` +
        TAB + TAB + "@private\n" +
        TAB + TAB + "@example\n" +
        TAB + TAB + TAB + "```javascript\n" +
        TAB + TAB + TAB + `_${attr.name}Changed: on('init', observer('${attr.name}', function() {\n` +
        TAB + TAB + TAB + TAB + `once(this, '_${attr.name}Compute');\n` +
        TAB + TAB + TAB + "}))\n" +
        TAB + TAB + TAB + "```\n" +
        TAB + "*/\n" +
        TAB + `_${attr.name}Compute: function() {\n` +
        TAB + TAB + `let result = (this.${attr.name}Compute && typeof this.${attr.name}Compute === 'function') ?` +
        (attr.name.length > 21 ? '\n' + TAB + TAB + TAB : ' ') + `this.${attr.name}Compute() : null;\n` +
        TAB + TAB + `this.set('${attr.name}', result);\n` +
        TAB + "}";
      attrs.push(methodToSetNotStoredProperty);
    }
    let belongsTo: metadata.DSbelongsTo;
    for (belongsTo of model.belongsTo) {
      attrs.push(templateBelongsTo(belongsTo));
    }
    for (let hasMany of model.hasMany) {
      attrs.push(templateHasMany(hasMany));
    }
    return attrs.length ? `\n${TAB + attrs.join(`,\n${TAB}`)}\n` : '';
  }

  joinProjHasMany(detailHasMany: metadata.ProjHasMany, modelsDir: string, level: number): SortedPair {
    let hasManyAttrs: SortedPair[] = [];
    let hasManyModel: metadata.Model = ModelBlueprint.loadModel(modelsDir, detailHasMany.relatedTo + ".json");
    let hasManyProj = lodash.find(hasManyModel.projections, function(pr: metadata.ProjectionForModel) { return pr.name === detailHasMany.projectionName; });
    if (hasManyProj) {
      for (let attr of hasManyProj.attrs) {
        hasManyAttrs.push(this.declareProjAttr(attr));
      }
      for (let belongsTo of hasManyProj.belongsTo) {
        hasManyAttrs.push(this.joinProjBelongsTo(belongsTo, level + 1));
      }
      let indent: string[] = [];
      for (let i = 0; i < level; i++) {
        indent.push(TAB);
      }
      let indentStr = indent.join("");
      indent.pop();
      let indentStr2 = indent.join("");
      hasManyAttrs=lodash.sortBy(hasManyAttrs,["index"]);
      let attrsStr = lodash.map(hasManyAttrs, "str").join(",\n" + indentStr);
      if(hasManyAttrs.length===0){
        attrsStr = "";
        indentStr = "";
      }
      return new SortedPair(Number.MAX_VALUE,`${detailHasMany.name}: hasMany('${detailHasMany.relatedTo}', '${detailHasMany.caption}', {\n${indentStr}${attrsStr}\n${indentStr2}})`);
    }
    return new SortedPair(Number.MAX_VALUE,"");
  }

  joinProjBelongsTo(belongsTo: metadata.ProjBelongsTo, level: number): SortedPair {
    let belongsToAttrs: SortedPair[] = [];
    let index=Number.MAX_VALUE;
    for (let attr of belongsTo.attrs) {
      belongsToAttrs.push(this.declareProjAttr(attr));
    }
    for (let belongsTo2 of belongsTo.belongsTo) {
      belongsToAttrs.push(this.joinProjBelongsTo(belongsTo2, level + 1));
    }
    let hiddenStr = "";
    if (belongsTo.hidden || belongsTo.index==-1) {
      hiddenStr = `, { index: ${belongsTo.index}, hidden: true }`;
    }else{
      index = belongsToAttrs[0].index;
      if (belongsTo.lookupValueField) {
        hiddenStr = `, { index: ${belongsTo.index}, displayMemberPath: '${belongsTo.lookupValueField}' }`;
      } else {
        hiddenStr = `, { index: ${belongsTo.index} }`;
      }
    }
    let indent: string[] = [];
    for (let i = 0; i < level; i++) {
      indent.push(TAB);
    }
    let indentStr = indent.join("");
    indent.pop();
    let indentStr2 = indent.join("");
    belongsToAttrs=lodash.sortBy(belongsToAttrs,["index"]);
    let attrsStr = lodash.map(belongsToAttrs, "str").join(",\n" + indentStr);
    if(belongsToAttrs.length===0){
      attrsStr = "";
      indentStr = "";
    }else{
      index=belongsToAttrs[0].index;
      if(index==-1)
        index=Number.MAX_VALUE;
    }
    return new SortedPair(index,`${belongsTo.name}: belongsTo('${belongsTo.relatedTo}', '${belongsTo.caption}', {\n${indentStr}${attrsStr}\n${indentStr2}}${hiddenStr})`);
  }

  declareProjAttr(attr: metadata.ProjAttr): SortedPair {
    let hiddenStr = "";
    if (attr.hidden) {
      hiddenStr = `, { index: ${attr.index}, hidden: true }`;
    } else {
      hiddenStr = `, { index: ${attr.index} }`;
    }
    return new SortedPair(attr.index, `${attr.name}: attr('${attr.caption}'${hiddenStr})`);
  }

  getJSForProjections(model: metadata.Model, modelsDir: string): string {
    let projections: string[] = [];
    let projName: string;
    if(model.projections.length===0){
      return null;
    }
    for (let proj of model.projections) {
      let projAttrs: SortedPair[] = [];
      for (let attr of proj.attrs) {
        projAttrs.push(this.declareProjAttr(attr));
      }
      for (let belongsTo of proj.belongsTo) {
        projAttrs.push(this.joinProjBelongsTo(belongsTo, 3));
      }
      for (let hasMany of proj.hasMany) {
        let hasManyAttrs: SortedPair[] = [];
        let detailModel: metadata.Model = ModelBlueprint.loadModel(modelsDir, hasMany.relatedTo + ".json");
        projName = hasMany.projectionName;
        let detailProj = lodash.find(detailModel.projections, function(pr: metadata.ProjectionForModel) { return pr.name === projName; });
        if (detailProj) {
          for (let detailAttr of detailProj.attrs) {
            hasManyAttrs.push(this.declareProjAttr(detailAttr));
          }
          for (let detailBelongsTo of detailProj.belongsTo) {
            hasManyAttrs.push(this.joinProjBelongsTo(detailBelongsTo, 4));
          }

          for (let detailHasMany of detailProj.hasMany) {
            hasManyAttrs.push(this.joinProjHasMany(detailHasMany, modelsDir, 4));
          }
        }
        hasManyAttrs=lodash.sortBy(hasManyAttrs,["index"]);
        let attrsStr = lodash.map(hasManyAttrs, "str").join(",\n      ");

        projAttrs.push(new SortedPair(Number.MAX_VALUE, `${hasMany.name}: hasMany('${hasMany.relatedTo}', '${hasMany.caption}', {\n      ${attrsStr}\n    })`));
      }
      projAttrs=lodash.sortBy(projAttrs,["index"]);
      let attrsStr = lodash.map(projAttrs, "str").join(",\n    ");
      projections.push(`  modelClass.defineProjection('${proj.name}', '${proj.modelName}', {\n    ${attrsStr}\n  });`);
    }
    return `\n${projections.join("\n\n")}\n`;
  }

  getValidations(model: metadata.Model): string {
    let validators = {};
    for (let attr of model.attrs) {
      validators[attr.name] = [`validator('ds-error'),`];
      switch (attr.type) {
        case 'date':
          validators[attr.name].push(`validator('date'),`);
          if (attr.notNull) {
            validators[attr.name].push(`validator('presence', true),`);
          }
          break;

        case 'string':
        case 'boolean':
          if (attr.notNull) {
            validators[attr.name].push(`validator('presence', true),`);
          }
          break;

        case 'number':
        case 'decimal':
          let options = 'allowString: true';
          options += attr.notNull ? '' : ', allowBlank: true';
          options += attr.type === 'number' ? ', integer: true' : '';

          validators[attr.name].push(`validator('number', { ${options} }),`);
          break;
      }
    }

    for (let belongsTo of model.belongsTo) {
      validators[belongsTo.name] = [`validator('ds-error'),`];
      if (belongsTo.presence) {
        validators[belongsTo.name].push(`validator('presence', true),`);
      }
    }

    for (let hasMany of model.hasMany) {
      validators[hasMany.name] = [`validator('ds-error'),`, `validator('has-many'),`];
    }

    let validations = [];
    for (let validationKey in validators) {
      let descriptionKey = `descriptionKey: 'models.${model.modelName}.validations.${validationKey}.__caption__',`;
      let _validators = `validators: [\n${TAB + TAB + TAB + validators[validationKey].join(`\n${TAB + TAB + TAB}`)}\n${TAB + TAB}],`;
      validations.push(`${TAB + validationKey}: {\n${TAB + TAB + descriptionKey}\n${TAB + TAB + _validators}\n${TAB}}`);
    }

    return validations.length ? `\n${validations.join(',\n')},\n` : '';
  }

  private getLocalePathTemplate(options, isDummy, localePathSuffix: string): lodash.TemplateExecutor {
    let targetRoot = "app"
    if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon" ) {
      targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
    }
    return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
  }
}
