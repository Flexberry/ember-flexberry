/*jshint node:true*/
var fs = require("fs");
var stripBom = require("strip-bom");
var template = require('lodash/template');
var find = require('lodash/find');
var path = require('path');

var templateProjAttr = template("<%=name%>: Proj.attr('<%=caption%>'<%=hiddenStr%>)");
var templateProjBelongsTo = template("<%=name%>: Proj.belongsTo('<%=relatedTo%>', '<%=caption%>', { \n<%=attrsStr%> \n}<%=hiddenStr%>)");
var templateProjHasMany = template("<%=name%>: Proj.hasMany('<%=relatedTo%>', '<%=caption%>', {\n<%=attrsStr%>\n})");

module.exports = {
    
    description: 'Generates an ember-data model for flexberry.', 

    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String }
    ],
     
    

    locals: function (options) {
        var modelsDir = path.join(options.metadataDir,"models");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        var modelFile = path.join(modelsDir, options.file);
        var content = stripBom(fs.readFileSync(modelFile, "utf8"));
        var model = JSON.parse(content);

        return {
            model: getJSForModel(model),
            projections: getJSForProjections(model, modelsDir),
            serializerAttrs: getSerializerAttrs(model)
        };
  }
};

function getSerializerAttrs(model) {
    var attrs = [];
    var idx, attr;
    for (idx in model.belongsTo) {
        attrs.push(model.belongsTo[idx].name+": { serialize: 'records', deserialize: 'records' }");
    }
    for (idx in model.hasMany) {
        attrs.push(model.hasMany[idx].name + ": { serialize: 'records', deserialize: 'records' }");
    }
    return attrs.join(",\n");
}

function getJSForProjections(model, modelsDir) {
    var projections = [];
    var idx, idx2, idx4;
    var templateDefineProjection = template("Model.defineProjection('<%=name%>', '<%=modelName%>', {\n<%=attrs%>\n});");
    for (idx in model.projections) {
        var proj = model.projections[idx];
        var projAttrs = [];
        for (idx2 in proj.attrs) {
            projAttrs.push(declareProjAttr(proj.attrs[idx2]));
        }
        for (idx2 in proj.belongsTo) {
            projAttrs.push(joinProjBelongsTo(proj.belongsTo[idx2]));
        }
        for (idx2 in proj.hasMany) {
            var hasMany = proj.hasMany[idx2];
            var hasManyAttrs = [];
            var modelFile = path.join(modelsDir, hasMany.relatedTo + ".json");
            var detailModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
            var detailProj = find(detailModel.projections, function (pr) { return pr.name === hasMany.projectionName; });
            if (detailProj) {
                for (idx4 in detailProj.attrs) {
                    hasManyAttrs.push(declareProjAttr(detailProj.attrs[idx4]));
                }
                for (idx4 in detailProj.belongsTo) {
                    hasManyAttrs.push(joinProjBelongsTo(detailProj.belongsTo[idx4]));
                }
                
                for (idx4 in detailProj.hasMany) {
                    hasManyAttrs.push(joinProjHasMany(detailProj.hasMany[idx4], modelsDir));
                }
            }
            hasMany.attrsStr = hasManyAttrs.join(",\n ");
            projAttrs.push(templateProjHasMany(hasMany));
        }
        proj.attrs = projAttrs.join(",\n ");
        projections.push(templateDefineProjection(proj));
    }
    return projections.join("\n ");
}


function getJSForModel(model) {
    var attrs = [], validations = [];
    var idx, attr;
    var templateAttr = template("<%=name%>: DS.attr('<%=type%>')");
    var templateBelongsTo = template("<%=name%>: DS.belongsTo('<%=relatedTo%>', { inverse: null, async: false })");
    var templateHasMany = template("<%=name%>: DS.hasMany('<%=relatedTo%>', { inverse: null, async: false })");
    for (idx in model.attrs) {
        attr = model.attrs[idx];
        attrs.push(templateAttr(attr));
        if (attr.notNull) {
            if (attr.type === "date") {
                validations.push(attr.name + ": { datetime: true }");
            } else {
                validations.push(attr.name + ": { presence: true }");
            }
        }
    }
    for (idx in model.belongsTo) {
        attrs.push(templateBelongsTo(model.belongsTo[idx]));
    }
    for (idx in model.hasMany) {
        attrs.push(templateHasMany(model.hasMany[idx]));
    }
    attrs.push("validations: { \n " + validations.join(",\n ") +"\n }");

    return "var Model = BaseModel.extend({\n" + attrs.join(",\n ") + "\n});";
}


function declareProjAttr(attr) {
    attr.hiddenStr = "";
    if (attr.hidden) {
        attr.hiddenStr = ", { hidden: true }";
    }
    return templateProjAttr(attr);
}

function joinProjHasMany(detailHasMany, modelsDir) {
    var hasManyAttrs = [];
    var idx3;
    
    var modelFile = path.join(modelsDir, detailHasMany.relatedTo + ".json");
    var hasManyModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
    var hasManyProj = find(hasManyModel.projections, function (pr) { return pr.name === detailHasMany.projectionName; });
    var idx5;
    if (hasManyProj) {
        for (idx3 in hasManyProj.attrs) {
            hasManyAttrs.push(declareProjAttr(hasManyProj.attrs[idx3]));
        }
        for (idx3 in hasManyProj.belongsTo) {
            hasManyAttrs.push(joinProjBelongsTo(hasManyProj.belongsTo[idx3]));
        }
        detailHasMany.attrsStr = hasManyAttrs.join(",\n ");
        return templateProjHasMany(detailHasMany);
    }
    return "";
}


function joinProjBelongsTo(belongsTo) {
    var belongsToAttrs = [];
    var idx3;
    for (idx3 in belongsTo.attrs) {
        belongsToAttrs.push(declareProjAttr(belongsTo.attrs[idx3]));
    }
    for (idx3 in belongsTo.belongsTo) {
        belongsToAttrs.push(joinProjBelongsTo(belongsTo.belongsTo[idx3]));
    }
    belongsTo.hiddenStr = "";
    if (belongsTo.hidden) {
        belongsTo.hiddenStr = ", { hidden: true }";
    }
    belongsTo.attrsStr = belongsToAttrs.join(",\n ");
    return templateProjBelongsTo(belongsTo);
}

