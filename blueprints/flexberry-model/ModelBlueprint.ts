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
  constructor(index: number, str: string) {
    this.index=index;
    this.str=str;
  }
  index: number;
  str: string;
}

export default class ModelBlueprint {
  model: string;
  serializerAttrs: string;
  parentModelName: string;
  parentClassName: string;
  className: string;
  projections: string;
  name: string;
  needsAllModels: string;
  needsAllEnums: string;
  lodashVariables: {};
  constructor(blueprint, options) {
    let modelsDir = path.join(options.metadataDir, "models");
    if (!options.file) {
      options.file = options.entity.name + ".json";
    }
    let modelFile = path.join(modelsDir, options.file);
    let content: string = stripBom(fs.readFileSync(modelFile, "utf8"));
    let model: metadata.Model = JSON.parse(content);
    this.parentModelName = model.parentModelName;
    this.parentClassName = model.parentClassName;
    this.className = model.className;
    this.serializerAttrs = this.getSerializerAttrs(model);
    this.projections = this.getJSForProjections(model, modelsDir);
    this.model = this.getJSForModel(model);
    this.name = options.entity.name;
    this.needsAllModels = this.getNeedsAllModels(modelsDir);
    this.needsAllEnums = this.getNeedsAllEnums(path.join(options.metadataDir, "enums"));
    let modelLocales = new ModelLocales(model, modelsDir, "ru");
    this.lodashVariables = modelLocales.getLodashVariables();
  }

  getNeedsAllEnums(enumsDir: string): string {
    let listEnums = fs.readdirSync(enumsDir);
    let enums: string[] = [];
    for (let e of listEnums) {
      enums.push(`    'transform:${path.parse(e).name}'`);
    }
    return enums.join(",\n");
  }

  getNeedsAllModels(modelsDir: string): string {
    let listModels = fs.readdirSync(modelsDir);
    let models: string[] = [];
    for (let model of listModels) {
      models.push(`    'model:${path.parse(model).name}'`);
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
    return "    "+attrs.join(",\n    ");
  }

  getJSForModel(model: metadata.Model): string {
    let attrs: string[] = [], validations: string[] = [];
    let templateBelongsTo = lodash.template("<%=name%>: DS.belongsTo('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false<%if(polymorphic){%>, polymorphic: true<%}%> })");
    let templateHasMany = lodash.template("<%=name%>: DS.hasMany('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false })");
    let attr: metadata.DSattr;
    for (attr of model.attrs) {
      attrs.push(`${attr.name}: DS.attr('${attr.type}')`);
      if (attr.notNull) {
        if (attr.type === "date") {
          validations.push(attr.name + ": { datetime: true }");
        } else {
          validations.push(attr.name + ": { presence: true }");
        }
      }
    }
    let belongsTo: metadata.DSbelongsTo;
    for (belongsTo of model.belongsTo) {
      if (belongsTo.presence)
        validations.push(belongsTo.name + ": { presence: true }");
      attrs.push(templateBelongsTo(belongsTo));
    }
    for (let hasMany of model.hasMany) {
      attrs.push(templateHasMany(hasMany));
    }
    let validationsStr="    "+validations.join(",\n    ");
    if(validations.length===0){
      validationsStr="";
    }
    attrs.push("validations: {\n" + validationsStr + "\n  }");
    return TAB + attrs.join(",\n" + TAB);
  }

  joinProjHasMany(detailHasMany: metadata.ProjHasMany, modelsDir: string, level: number): SortedPair {
    let hasManyAttrs: SortedPair[] = [];
    let modelFile = path.join(modelsDir, detailHasMany.relatedTo + ".json");
    let hasManyModel: metadata.Model = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
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
      return new SortedPair(Number.MAX_VALUE,`${detailHasMany.name}: Projection.hasMany('${detailHasMany.relatedTo}', '${detailHasMany.caption}', {\n${indentStr}${attrsStr}\n${indentStr2}})`);
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
      hiddenStr = ", { hidden: true }";
    }else{
      if(belongsTo.lookupValueField)
        hiddenStr = `, { displayMemberPath: '${belongsTo.lookupValueField}' }`;
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
    return new SortedPair(index,`${belongsTo.name}: Projection.belongsTo('${belongsTo.relatedTo}', '${belongsTo.caption}', {\n${indentStr}${attrsStr}\n${indentStr2}}${hiddenStr})`);
  }

  declareProjAttr(attr: metadata.ProjAttr): SortedPair {
    let hiddenStr = "";
    if (attr.hidden) {
      hiddenStr = ", { hidden: true }";
    }
    return new SortedPair(attr.index, `${attr.name}: Projection.attr('${attr.caption}'${hiddenStr})`);
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
        let modelFile = path.join(modelsDir, hasMany.relatedTo + ".json");
        let detailModel: metadata.Model = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
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

        projAttrs.push(new SortedPair(Number.MAX_VALUE, `${hasMany.name}: Projection.hasMany('${hasMany.relatedTo}', '${hasMany.caption}', {\n      ${attrsStr}\n    })`));
      }
      projAttrs=lodash.sortBy(projAttrs,["index"]);
      let attrsStr = lodash.map(projAttrs, "str").join(",\n    ");
      projections.push(`  model.defineProjection('${proj.name}', '${proj.modelName}', {\n    ${attrsStr}\n  });`);
    }
    return `\n${projections.join("\n")}\n`;
  }
}
