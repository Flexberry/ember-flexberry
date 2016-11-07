/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
var stripBom = require("strip-bom");
var fs = require("fs");
var path = require('path');
var lodash = require('lodash');
var Locales_1 = require('../flexberry-core/Locales');
var TAB = "  ";
var SortedPair = (function () {
    function SortedPair(index, str) {
        this.index = index;
        this.str = str;
    }
    return SortedPair;
}());
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
        this.className = model.className;
        this.serializerAttrs = this.getSerializerAttrs(model);
        this.projections = this.getJSForProjections(model, modelsDir);
        this.model = this.getJSForModel(model);
        this.name = options.entity.name;
        this.needsAllModels = this.getNeedsAllModels(modelsDir);
        this.needsAllEnums = this.getNeedsAllEnums(path.join(options.metadataDir, "enums"));
        var modelLocales = new Locales_1.ModelLocales(model, modelsDir, "ru");
        this.lodashVariables = modelLocales.getLodashVariablesProperties();
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
        var templateBelongsTo = lodash.template("<%=name%>: DS.belongsTo('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false<%if(polymorphic){%>, polymorphic: true<%}%> })");
        var templateHasMany = lodash.template("<%=name%>: DS.hasMany('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false })");
        var attr;
        for (var _i = 0, _a = model.attrs; _i < _a.length; _i++) {
            attr = _a[_i];
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
        var belongsTo;
        for (var _b = 0, _c = model.belongsTo; _b < _c.length; _b++) {
            belongsTo = _c[_b];
            if (belongsTo.presence)
                validations.push(belongsTo.name + ": { presence: true }");
            attrs.push(templateBelongsTo(belongsTo));
        }
        for (var _d = 0, _e = model.hasMany; _d < _e.length; _d++) {
            var hasMany = _e[_d];
            attrs.push(templateHasMany(hasMany));
        }
        var validationsFunc = TAB + TAB + TAB + validations.join(",\n" + TAB + TAB + TAB) + "\n";
        if (validations.length === 0) {
            validationsFunc = "";
        }
        validationsFunc = "getValidations: function () {\n" +
            TAB + TAB + "let parentValidations = this._super();\n" +
            TAB + TAB + "let thisValidations = {\n" +
            validationsFunc + TAB + TAB + "};\n" +
            TAB + TAB + "return Ember.$.extend(true, {}, parentValidations, thisValidations);\n" +
            TAB + "}";
        var initFunction = "init: function () {\n" +
            TAB + TAB + "this.set('validations', this.getValidations());\n" +
            TAB + TAB + "this._super.apply(this, arguments);\n" +
            TAB + "}";
        attrs.push(validationsFunc, initFunction);
        return TAB + attrs.join(",\n" + TAB);
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
            hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
            var attrsStr = lodash.map(hasManyAttrs, "str").join(",\n" + indentStr);
            if (hasManyAttrs.length === 0) {
                attrsStr = "";
                indentStr = "";
            }
            return new SortedPair(Number.MAX_VALUE, detailHasMany.name + ": Projection.hasMany('" + detailHasMany.relatedTo + "', '" + detailHasMany.caption + "', {\n" + indentStr + attrsStr + "\n" + indentStr2 + "})");
        }
        return new SortedPair(Number.MAX_VALUE, "");
    };
    ModelBlueprint.prototype.joinProjBelongsTo = function (belongsTo, level) {
        var belongsToAttrs = [];
        var index = Number.MAX_VALUE;
        for (var _i = 0, _a = belongsTo.attrs; _i < _a.length; _i++) {
            var attr = _a[_i];
            belongsToAttrs.push(this.declareProjAttr(attr));
        }
        for (var _b = 0, _c = belongsTo.belongsTo; _b < _c.length; _b++) {
            var belongsTo2 = _c[_b];
            belongsToAttrs.push(this.joinProjBelongsTo(belongsTo2, level + 1));
        }
        var hiddenStr = "";
        if (belongsTo.hidden || belongsTo.index == -1) {
            hiddenStr = ", { hidden: true }";
        }
        else {
            if (belongsTo.lookupValueField)
                hiddenStr = ", { displayMemberPath: '" + belongsTo.lookupValueField + "' }";
        }
        var indent = [];
        for (var i = 0; i < level; i++) {
            indent.push(TAB);
        }
        var indentStr = indent.join("");
        indent.pop();
        var indentStr2 = indent.join("");
        belongsToAttrs = lodash.sortBy(belongsToAttrs, ["index"]);
        var attrsStr = lodash.map(belongsToAttrs, "str").join(",\n" + indentStr);
        if (belongsToAttrs.length === 0) {
            attrsStr = "";
            indentStr = "";
        }
        else {
            index = belongsToAttrs[0].index;
            if (index == -1)
                index = Number.MAX_VALUE;
        }
        return new SortedPair(index, belongsTo.name + ": Projection.belongsTo('" + belongsTo.relatedTo + "', '" + belongsTo.caption + "', {\n" + indentStr + attrsStr + "\n" + indentStr2 + "}" + hiddenStr + ")");
    };
    ModelBlueprint.prototype.declareProjAttr = function (attr) {
        var hiddenStr = "";
        if (attr.hidden) {
            hiddenStr = ", { hidden: true }";
        }
        return new SortedPair(attr.index, attr.name + ": Projection.attr('" + attr.caption + "'" + hiddenStr + ")");
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
                projAttrs.push(this.joinProjBelongsTo(belongsTo, 3));
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
                        hasManyAttrs.push(this.joinProjBelongsTo(detailBelongsTo, 4));
                    }
                    for (var _m = 0, _o = detailProj.hasMany; _m < _o.length; _m++) {
                        var detailHasMany = _o[_m];
                        hasManyAttrs.push(this.joinProjHasMany(detailHasMany, modelsDir, 4));
                    }
                }
                hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
                var attrsStr_1 = lodash.map(hasManyAttrs, "str").join(",\n      ");
                projAttrs.push(new SortedPair(Number.MAX_VALUE, hasMany.name + ": Projection.hasMany('" + hasMany.relatedTo + "', '" + hasMany.caption + "', {\n      " + attrsStr_1 + "\n    })"));
            }
            projAttrs = lodash.sortBy(projAttrs, ["index"]);
            var attrsStr = lodash.map(projAttrs, "str").join(",\n    ");
            projections.push("  model.defineProjection('" + proj.name + "', '" + proj.modelName + "', {\n    " + attrsStr + "\n  });");
        }
        return "\n" + projections.join("\n") + "\n";
    };
    return ModelBlueprint;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelBlueprint;
//# sourceMappingURL=ModelBlueprint.js.map