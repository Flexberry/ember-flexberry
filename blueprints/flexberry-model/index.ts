/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />

let stripBom = require("strip-bom");
import fs = require("fs");
import path = require('path');
import lodash = require('lodash');
const TAB = "  ";

module.exports = {

  description: 'Generates an ember-data model for flexberry.',

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
   * @return {Object} Custom template variables.
   */
  locals: function (options) {
    let modelBlueprint = new ModelBlueprint(this, options);
    return {
      parentModelName: modelBlueprint.parentModelName,// for use in files\__root__\models\__name__.js
      parentClasslName: modelBlueprint.parentClasslName,// for use in files\__root__\models\__name__.js
      model: modelBlueprint.model,// for use in files\__root__\models\__name__.js
      projections: modelBlueprint.projections,// for use in files\__root__\models\__name__.js
      serializerAttrs: modelBlueprint.serializerAttrs// for use in files\__root__\serializers\__name__.js
    };
  }
};

class ModelBlueprint {
  model: any;
  serializerAttrs: any;
  parentModelName: any;
  parentClasslName: any;
  projections: any;
  constructor(blueprint, options) {
    let modelsDir = path.join(options.metadataDir, "models");
    if (!options.file) {
      options.file = options.entity.name + ".json";
    }
    let modelFile = path.join(modelsDir, options.file);
    let content = stripBom(fs.readFileSync(modelFile, "utf8"));
    let model = JSON.parse(content);
    this.parentModelName = model.parentModelName;
    this.parentClasslName = model.parentClasslName;
    this.serializerAttrs = this.getSerializerAttrs(model);
    this.projections = this.getJSForProjections(model, modelsDir);
    this.model = this.getJSForModel(model);
  }

  getSerializerAttrs(model) {
    let attrs = [];
    for (let belongsTo of model.belongsTo) {
      attrs.push(belongsTo.name + ": { serialize: 'odata-id', deserialize: 'records' }");
    }
    for (let hasMany of model.hasMany) {
      attrs.push(hasMany.name + ": { serialize: false, deserialize: 'records' }");
    }
    return attrs.join(",\n");
  }

  getJSForModel(model) {
    let attrs = [], validations = [];
    let templateBelongsTo = lodash.template("<%=name%>: DS.belongsTo('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false })");
    let templateHasMany = lodash.template("<%=name%>: DS.hasMany('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false })");
    for (let attr of model.attrs) {
      attrs.push(`${attr.name}: DS.attr('${attr.type}')`);
      if (attr.notNull) {
        if (attr.type === "date") {
          validations.push(attr.name + ": { datetime: true }");
        } else {
          validations.push(attr.name + ": { presence: true }");
        }
      }
    }
    for (let belongsTo of model.belongsTo) {
      attrs.push(templateBelongsTo(belongsTo));
    }
    for (let hasMany of model.hasMany) {
      attrs.push(templateHasMany(hasMany));
    }
    attrs.push("validations: { \n " + validations.join(",\n ") + "\n }");
    return "({\n" + TAB + attrs.join(",\n" + TAB) + "\n});";
  }

  joinProjHasMany(detailHasMany, modelsDir) {
    let hasManyAttrs = [];
    let modelFile = path.join(modelsDir, detailHasMany.relatedTo + ".json");
    let hasManyModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
    let hasManyProj = lodash.find(hasManyModel.projections, function (pr:any) { return pr.name === detailHasMany.projectionName; });
    if (hasManyProj) {
      for (let attr of hasManyProj.attrs) {
        hasManyAttrs.push(this.declareProjAttr(attr));
      }
      for (let belongsTo of hasManyProj.belongsTo) {
        hasManyAttrs.push(this.joinProjBelongsTo(belongsTo,1));
      }
      let attrsStr = hasManyAttrs.join(",\n ");
      return `${detailHasMany.name}: Proj.hasMany('${detailHasMany.relatedTo}', '${detailHasMany.caption}', {\n${attrsStr}\n})`;    }
    return "";
  }

  joinProjBelongsTo(belongsTo, level) {
    let belongsToAttrs = [];
    for (let attr of belongsTo.attrs) {
      belongsToAttrs.push(this.declareProjAttr(attr));
    }
    for (let belongsTo2 of belongsTo.belongsTo) {
      belongsToAttrs.push(this.joinProjBelongsTo(belongsTo2, level + 1));
    }
    let hiddenStr = "";
    if (belongsTo.hidden) {
      hiddenStr = ", { hidden: true }";
    }
    let indent = [];
    for (let i = 0; i < level; i++) {
      indent.push(TAB);
    }
    let indentStr = indent.join("");
    let attrsStr = belongsToAttrs.join(",\n" + indentStr);
    return `${belongsTo.name}: Proj.belongsTo('${belongsTo.relatedTo}', '${belongsTo.caption}', { \n${indentStr}${attrsStr} \n${indentStr}}${hiddenStr})`;
  }

  declareProjAttr(attr) {
    let hiddenStr = "";
    if (attr.hidden) {
      hiddenStr = ", { hidden: true }";
    }
    return `${attr.name}: Proj.attr('${attr.caption}'${hiddenStr})`;
  }

  getJSForProjections(model, modelsDir) {
    let projections = [];
    let projName;
    for (let proj of model.projections) {
      let projAttrs = [];
      for (let attr of proj.attrs) {
        projAttrs.push(this.declareProjAttr(attr));
      }
      for (let belongsTo of proj.belongsTo) {
        projAttrs.push(this.joinProjBelongsTo(belongsTo, 1));
      }
      for (let hasMany of proj.hasMany) {
        let hasManyAttrs = [];
        let modelFile = path.join(modelsDir, hasMany.relatedTo + ".json");
        let detailModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
        projName = hasMany.projectionName;
        let detailProj = lodash.find(detailModel.projections, function (pr: any) { return pr.name === projName; });
        if (detailProj) {
          for (let detailAttr of detailProj.attrs) {
            hasManyAttrs.push(this.declareProjAttr(detailAttr));
          }
          for (let detailBelongsTo of detailProj.belongsTo) {
            hasManyAttrs.push(this.joinProjBelongsTo(detailBelongsTo, 2));
          }

          for (let detailHasMany of detailProj.hasMany) {
            hasManyAttrs.push(this.joinProjHasMany(detailHasMany, modelsDir));
          }
        }
        let attrsStr = hasManyAttrs.join(",\n" + TAB);
        projAttrs.push(`${hasMany.name}: Proj.hasMany('${hasMany.relatedTo}', '${hasMany.caption}', {\n${attrsStr}\n})`);
      }
      let attrsStr = projAttrs.join(",\n" + TAB);
      projections.push(`Model.defineProjection('${proj.name}', '${proj.modelName}', {\n${attrsStr}\n});`);
    }
    return projections.join("\n" + TAB);
  }
}
