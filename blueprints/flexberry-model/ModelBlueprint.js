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
        var model = ModelBlueprint.loadModel(modelsDir, options.file);
        this.parentModelName = model.parentModelName;
        this.parentClassName = model.parentClassName;
        if (model.parentModelName) {
            var parentModel = ModelBlueprint.loadModel(modelsDir, model.parentModelName + ".json");
            this.parentExternal = parentModel.external;
        }
        this.className = model.className;
        this.serializerAttrs = this.getSerializerAttrs(model);
        this.offlineSerializerAttrs = this.getOfflineSerializerAttrs(model);
        this.projections = this.getJSForProjections(model, modelsDir);
        this.model = this.getJSForModel(model);
        this.name = options.entity.name;
        this.needsAllModels = this.getNeedsAllModels(modelsDir);
        this.needsAllEnums = this.getNeedsTransforms(path.join(options.metadataDir, "enums"));
        this.needsAllObjects = this.getNeedsTransforms(path.join(options.metadataDir, "objects"));
        var modelLocales = new Locales_1.ModelLocales(model, modelsDir, "ru");
        this.lodashVariables = modelLocales.getLodashVariablesProperties();
        this.validations = this.getValidations(model, options.metadataDir);
    }
    ModelBlueprint.loadModel = function (modelsDir, modelFileName) {
        var modelFile = path.join(modelsDir, modelFileName);
        var content = stripBom(fs.readFileSync(modelFile, "utf8"));
        var model = JSON.parse(content);
        return model;
    };
    ModelBlueprint.prototype.getNeedsTransforms = function (dir) {
        var list = fs.readdirSync(dir);
        var transforms = [];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var e = list_1[_i];
            var pp = path.parse(e);
            if (pp.ext != ".json")
                continue;
            transforms.push("    'transform:" + pp.name + "'");
        }
        return transforms.join(",\n");
    };
    ModelBlueprint.prototype.getNeedsAllModels = function (modelsDir) {
        var listModels = fs.readdirSync(modelsDir);
        var models = [];
        for (var _i = 0, listModels_1 = listModels; _i < listModels_1.length; _i++) {
            var model = listModels_1[_i];
            var pp = path.parse(model);
            if (pp.ext != ".json")
                continue;
            models.push("    'model:" + pp.name + "'");
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
        return "      " + attrs.join(",\n      ");
    };
    ModelBlueprint.prototype.getOfflineSerializerAttrs = function (model) {
        var attrs = [];
        for (var _i = 0, _a = model.belongsTo; _i < _a.length; _i++) {
            var belongsTo = _a[_i];
            attrs.push(belongsTo.name + ": { serialize: 'id', deserialize: 'records' }");
        }
        for (var _b = 0, _c = model.hasMany; _b < _c.length; _b++) {
            var hasMany = _c[_b];
            attrs.push(hasMany.name + ": { serialize: 'ids', deserialize: 'records' }");
        }
        if (attrs.length === 0) {
            return "";
        }
        return "      " + attrs.join(",\n      ");
    };
    ModelBlueprint.prototype.getJSForModel = function (model) {
        var attrs = [];
        var templateBelongsTo = lodash.template("<%=name%>: DS.belongsTo('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false<%if(polymorphic){%>, polymorphic: true<%}%> })");
        var templateHasMany = lodash.template("<%=name%>: DS.hasMany('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false })");
        var attr;
        for (var _i = 0, _a = model.attrs; _i < _a.length; _i++) {
            attr = _a[_i];
            var comment = "";
            if (!attr.stored) {
                comment =
                    "/**\n" +
                        TAB + TAB + "Non-stored property.\n\n" +
                        TAB + TAB + ("@property " + attr.name + "\n") +
                        TAB + "*/\n" + TAB;
            }
            attrs.push("" + comment + attr.name + ": DS.attr('" + attr.type + "')");
            if (attr.stored)
                continue;
            var methodToSetNotStoredProperty = "/**\n" +
                TAB + TAB + "Method to set non-stored property.\n" +
                TAB + TAB + "Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.\n" +
                TAB + TAB + ("Please, implement '" + attr.name + "Compute' method in model class (outside of this mixin) if you want to compute value of '" + attr.name + "' property.\n\n") +
                TAB + TAB + ("@method _" + attr.name + "Compute\n") +
                TAB + TAB + "@private\n" +
                TAB + TAB + "@example\n" +
                TAB + TAB + TAB + "```javascript\n" +
                TAB + TAB + TAB + ("_" + attr.name + "Changed: Ember.on('init', Ember.observer('" + attr.name + "', function() {\n") +
                TAB + TAB + TAB + TAB + ("Ember.run.once(this, '_" + attr.name + "Compute');\n") +
                TAB + TAB + TAB + "}))\n" +
                TAB + TAB + TAB + "```\n" +
                TAB + "*/\n" +
                TAB + ("_" + attr.name + "Compute: function() {\n") +
                TAB + TAB + ("let result = (this." + attr.name + "Compute && typeof this." + attr.name + "Compute === 'function') ? this." + attr.name + "Compute() : null;\n") +
                TAB + TAB + ("this.set('" + attr.name + "', result);\n") +
                TAB + "}";
            attrs.push(methodToSetNotStoredProperty);
        }
        var belongsTo;
        for (var _b = 0, _c = model.belongsTo; _b < _c.length; _b++) {
            belongsTo = _c[_b];
            attrs.push(templateBelongsTo(belongsTo));
        }
        for (var _d = 0, _e = model.hasMany; _d < _e.length; _d++) {
            var hasMany = _e[_d];
            attrs.push(templateHasMany(hasMany));
        }
        return TAB + attrs.join(",\n" + TAB);
    };
    ModelBlueprint.prototype.joinProjHasMany = function (detailHasMany, modelsDir, level) {
        var hasManyAttrs = [];
        var hasManyModel = ModelBlueprint.loadModel(modelsDir, detailHasMany.relatedTo + ".json");
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
                var detailModel = ModelBlueprint.loadModel(modelsDir, hasMany.relatedTo + ".json");
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
            projections.push("  modelClass.defineProjection('" + proj.name + "', '" + proj.modelName + "', {\n    " + attrsStr + "\n  });");
        }
        return "\n" + projections.join("\n") + "\n";
    };
    ModelBlueprint.prototype.getValidations = function (model, metadataDir) {
        var validations = {};
        var usedProjections = {};
        var modelsDir = path.join(metadataDir, "models");
        var parentModel = model.parentModelName ? ModelBlueprint.loadModel(modelsDir, model.parentModelName + ".json") : null;
        var editFormsDir = path.join(metadataDir, "edit-forms");
        var editForms = fs.readdirSync(editFormsDir);
        for (var _i = 0, editForms_1 = editForms; _i < editForms_1.length; _i++) {
            var form = editForms_1[_i];
            if (path.parse(form).ext === ".json") {
                var content = fs.readFileSync(path.join(editFormsDir, form), "utf8");
                var editForm = JSON.parse(stripBom(content));
                editForm.projections.forEach(function (projection) {
                    if (projection.modelName === model.modelName) {
                        usedProjections[projection.modelProjection] = true;
                    }
                });
            }
        }
        for (var _a = 0, _b = model.projections; _a < _b.length; _a++) {
            var projection = _b[_a];
            if (usedProjections[projection.name]) {
                var validation = [];
                var _loop_1 = function(attr) {
                    var aParentModel = parentModel;
                    var attrs = model.attrs.filter(function (a) { return a.name === attr.name; });
                    while (attrs.length === 0 && aParentModel) {
                        attrs = aParentModel.attrs.filter(function (a) { return a.name === attr.name; });
                        aParentModel = aParentModel.parentModelName ? ModelBlueprint.loadModel(modelsDir, aParentModel.parentModelName + ".json") : null;
                    }
                    if (attrs.length !== 1) {
                        throw new Error("In '" + model.name + "' model too many or too few attributes with name '" + attr.name + "'.");
                    }
                    if (attrs[0].notNull) {
                        if (attrs[0].type === "date") {
                            validation.push("'model." + attrs[0].name + "': { datetime: true }");
                        }
                        else {
                            validation.push("'model." + attrs[0].name + "': { presence: true }");
                        }
                    }
                };
                for (var _c = 0, _d = projection.attrs; _c < _d.length; _c++) {
                    var attr = _d[_c];
                    _loop_1(attr);
                }
                var _loop_2 = function(belongsTo) {
                    var bParentModel = parentModel;
                    var belongsTos = model.belongsTo.filter(function (b) { return b.name === belongsTo.name; });
                    while (belongsTos.length === 0 && bParentModel) {
                        belongsTos = bParentModel.belongsTo.filter(function (b) { return b.name === belongsTo.name; });
                        bParentModel = bParentModel.parentModelName ? ModelBlueprint.loadModel(modelsDir, bParentModel.parentModelName + ".json") : null;
                    }
                    if (belongsTos.length !== 1) {
                        throw new Error("In '" + model.name + "' model too many or too few relations with name '" + belongsTo.name + "'.");
                    }
                    if (belongsTos[0].presence) {
                        validation.push("'model." + belongsTos[0].name + "': { presence: true }");
                    }
                };
                for (var _e = 0, _f = projection.belongsTo; _e < _f.length; _e++) {
                    var belongsTo = _f[_e];
                    _loop_2(belongsTo);
                }
                validations[(projection.name + "Validation")] = validation.length ? "\n" + (TAB + TAB + validation.join(",\n" + (TAB + TAB))) + ",\n" + TAB : '';
            }
        }
        return validations;
    };
    return ModelBlueprint;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelBlueprint;
//# sourceMappingURL=ModelBlueprint.js.map