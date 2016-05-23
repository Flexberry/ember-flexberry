/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
var stripBom = require("strip-bom");
var fs = require("fs");
var path = require('path');
var lodash = require('lodash');
var TAB = "  ";
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
        var modelBlueprint = new ModelBlueprint(this, options);
        return {
            parentModelName: modelBlueprint.parentModelName,
            parentClassName: modelBlueprint.parentClassName,
            model: modelBlueprint.model,
            projections: modelBlueprint.projections,
            serializerAttrs: modelBlueprint.serializerAttrs,
            name: modelBlueprint.name,
            needsAllModels: modelBlueprint.needsAllModels,
            needsAllEnums: modelBlueprint.needsAllEnums // for use in files\tests\unit\serializers\__name__.js
        };
    }
};
var ModelBlueprint = (function () {
    function ModelBlueprint(blueprint, options) {
        var modelsDir = path.join(options.metadataDir, "models");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        var modelFile = path.join(modelsDir, options.file);
        var content = stripBom(fs.readFileSync(modelFile, "utf8"));
        var model = JSON.parse(content);
        this.parentModelName = model.parentModelName;
        this.parentClassName = model.parentClassName;
        this.serializerAttrs = this.getSerializerAttrs(model);
        this.projections = this.getJSForProjections(model, modelsDir);
        this.model = this.getJSForModel(model);
        this.name = options.entity.name;
        this.needsAllModels = this.getNeedsAllModels(modelsDir);
        this.needsAllEnums = this.getNeedsAllEnums(path.join(options.metadataDir, "enums"));
    }
    ModelBlueprint.prototype.getNeedsAllEnums = function (enumsDir) {
        var listEnums = fs.readdirSync(enumsDir);
        var enums = [];
        for (var _i = 0, listEnums_1 = listEnums; _i < listEnums_1.length; _i++) {
            var e = listEnums_1[_i];
            enums.push("    'transform:" + path.parse(e).name + "'");
        }
        return enums.join(",\n");
    };
    ModelBlueprint.prototype.getNeedsAllModels = function (modelsDir) {
        var listModels = fs.readdirSync(modelsDir);
        var models = [];
        for (var _i = 0, listModels_1 = listModels; _i < listModels_1.length; _i++) {
            var model = listModels_1[_i];
            models.push("    'model:" + path.parse(model).name + "'");
        }
        return models.join(",\n");
    };
    ModelBlueprint.prototype.getSerializerAttrs = function (model) {
        var attrs = [];
        for (var _i = 0, _a = model.belongsTo; _i < _a.length; _i++) {
            var belongsTo = _a[_i];
            attrs.push(belongsTo.name + ": { serialize: 'odata-id', deserialize: 'records' }");
        }
        for (var _b = 0, _c = model.hasMany; _b < _c.length; _b++) {
            var hasMany = _c[_b];
            attrs.push(hasMany.name + ": { serialize: false, deserialize: 'records' }");
        }
        if (attrs.length === 0) {
            return "";
        }
        return "    " + attrs.join(",\n    ");
    };
    ModelBlueprint.prototype.getJSForModel = function (model) {
        var attrs = [], validations = [];
        var templateBelongsTo = lodash.template("<%=name%>: DS.belongsTo('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false })");
        var templateHasMany = lodash.template("<%=name%>: DS.hasMany('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false })");
        for (var _i = 0, _a = model.attrs; _i < _a.length; _i++) {
            var attr = _a[_i];
            attrs.push(attr.name + ": DS.attr('" + attr.type + "')");
            if (attr.notNull) {
                if (attr.type === "date") {
                    validations.push(attr.name + ": { datetime: true }");
                }
                else {
                    validations.push(attr.name + ": { presence: true }");
                }
            }
        }
        for (var _b = 0, _c = model.belongsTo; _b < _c.length; _b++) {
            var belongsTo = _c[_b];
            attrs.push(templateBelongsTo(belongsTo));
        }
        for (var _d = 0, _e = model.hasMany; _d < _e.length; _d++) {
            var hasMany = _e[_d];
            attrs.push(templateHasMany(hasMany));
        }
        var validationsStr = "    " + validations.join(",\n    ");
        if (validations.length === 0) {
            validationsStr = "";
        }
        attrs.push("validations: {\n" + validationsStr + "\n  }");
        return "({\n" + TAB + attrs.join(",\n" + TAB) + "\n});";
    };
    ModelBlueprint.prototype.joinProjHasMany = function (detailHasMany, modelsDir, level) {
        var hasManyAttrs = [];
        var modelFile = path.join(modelsDir, detailHasMany.relatedTo + ".json");
        var hasManyModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
        var hasManyProj = lodash.find(hasManyModel.projections, function (pr) { return pr.name === detailHasMany.projectionName; });
        if (hasManyProj) {
            for (var _i = 0, _a = hasManyProj.attrs; _i < _a.length; _i++) {
                var attr = _a[_i];
                hasManyAttrs.push(this.declareProjAttr(attr));
            }
            for (var _b = 0, _c = hasManyProj.belongsTo; _b < _c.length; _b++) {
                var belongsTo = _c[_b];
                hasManyAttrs.push(this.joinProjBelongsTo(belongsTo, level + 1));
            }
            var indent = [];
            for (var i = 0; i < level; i++) {
                indent.push(TAB);
            }
            var indentStr = indent.join("");
            indent.pop();
            var indentStr2 = indent.join("");
            var attrsStr = hasManyAttrs.join(",\n" + indentStr);
            if (hasManyAttrs.length === 0) {
                attrsStr = "";
                indentStr = "";
            }
            return detailHasMany.name + ": Proj.hasMany('" + detailHasMany.relatedTo + "', '" + detailHasMany.caption + "', {\n" + indentStr + attrsStr + "\n" + indentStr2 + "})";
        }
        return "";
    };
    ModelBlueprint.prototype.joinProjBelongsTo = function (belongsTo, level) {
        var belongsToAttrs = [];
        for (var _i = 0, _a = belongsTo.attrs; _i < _a.length; _i++) {
            var attr = _a[_i];
            belongsToAttrs.push(this.declareProjAttr(attr));
        }
        for (var _b = 0, _c = belongsTo.belongsTo; _b < _c.length; _b++) {
            var belongsTo2 = _c[_b];
            belongsToAttrs.push(this.joinProjBelongsTo(belongsTo2, level + 1));
        }
        var hiddenStr = "";
        if (belongsTo.hidden) {
            hiddenStr = ", { hidden: true }";
        }
        var indent = [];
        for (var i = 0; i < level; i++) {
            indent.push(TAB);
        }
        var indentStr = indent.join("");
        indent.pop();
        var indentStr2 = indent.join("");
        var attrsStr = belongsToAttrs.join(",\n" + indentStr);
        if (belongsToAttrs.length === 0) {
            attrsStr = "";
            indentStr = "";
        }
        return belongsTo.name + ": Proj.belongsTo('" + belongsTo.relatedTo + "', '" + belongsTo.caption + "', {\n" + indentStr + attrsStr + "\n" + indentStr2 + "}" + hiddenStr + ")";
    };
    ModelBlueprint.prototype.declareProjAttr = function (attr) {
        var hiddenStr = "";
        if (attr.hidden) {
            hiddenStr = ", { hidden: true }";
        }
        return attr.name + ": Proj.attr('" + attr.caption + "'" + hiddenStr + ")";
    };
    ModelBlueprint.prototype.getJSForProjections = function (model, modelsDir) {
        var projections = [];
        var projName;
        if (model.projections.length === 0) {
            return null;
        }
        for (var _i = 0, _a = model.projections; _i < _a.length; _i++) {
            var proj = _a[_i];
            var projAttrs = [];
            for (var _b = 0, _c = proj.attrs; _b < _c.length; _b++) {
                var attr = _c[_b];
                projAttrs.push(this.declareProjAttr(attr));
            }
            for (var _d = 0, _e = proj.belongsTo; _d < _e.length; _d++) {
                var belongsTo = _e[_d];
                projAttrs.push(this.joinProjBelongsTo(belongsTo, 2));
            }
            for (var _f = 0, _g = proj.hasMany; _f < _g.length; _f++) {
                var hasMany = _g[_f];
                var hasManyAttrs = [];
                var modelFile = path.join(modelsDir, hasMany.relatedTo + ".json");
                var detailModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
                projName = hasMany.projectionName;
                var detailProj = lodash.find(detailModel.projections, function (pr) { return pr.name === projName; });
                if (detailProj) {
                    for (var _h = 0, _j = detailProj.attrs; _h < _j.length; _h++) {
                        var detailAttr = _j[_h];
                        hasManyAttrs.push(this.declareProjAttr(detailAttr));
                    }
                    for (var _k = 0, _l = detailProj.belongsTo; _k < _l.length; _k++) {
                        var detailBelongsTo = _l[_k];
                        hasManyAttrs.push(this.joinProjBelongsTo(detailBelongsTo, 3));
                    }
                    for (var _m = 0, _o = detailProj.hasMany; _m < _o.length; _m++) {
                        var detailHasMany = _o[_m];
                        hasManyAttrs.push(this.joinProjHasMany(detailHasMany, modelsDir, 3));
                    }
                }
                var attrsStr_1 = hasManyAttrs.join(",\n    ");
                projAttrs.push(hasMany.name + ": Proj.hasMany('" + hasMany.relatedTo + "', '" + hasMany.caption + "', {\n    " + attrsStr_1 + "\n  })");
            }
            var attrsStr = projAttrs.join(",\n" + TAB);
            projections.push("Model.defineProjection('" + proj.name + "', '" + proj.modelName + "', {\n  " + attrsStr + "\n});");
        }
        return projections.join("\n");
    };
    return ModelBlueprint;
}());
//# sourceMappingURL=index.js.map