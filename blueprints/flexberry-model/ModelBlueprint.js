"use strict";
/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
var stripBom = require("strip-bom");
var fs = require("fs");
var path = require("path");
var lodash = require("lodash");
var Locales_1 = require("../flexberry-core/Locales");
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
        this.validations = this.getValidations(model);
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
            var defaultValue = "";
            if (attr.defaultValue) {
                switch (attr.type) {
                    case 'decimal':
                    case 'number':
                    case 'boolean':
                        defaultValue = ", { defaultValue: " + attr.defaultValue + " }";
                        break;
                    case 'date':
                        if (attr.defaultValue === 'Now') {
                            defaultValue = ", { defaultValue() { return new Date(); } }";
                            break;
                        }
                        break;
                    default:
                        defaultValue = ", { defaultValue: '" + attr.defaultValue + "' }";
                }
            }
            attrs.push("" + comment + attr.name + ": DS.attr('" + attr.type + "'" + defaultValue + ")");
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
                TAB + TAB + TAB + ("_" + attr.name + "Changed: on('init', observer('" + attr.name + "', function() {\n") +
                TAB + TAB + TAB + TAB + ("once(this, '_" + attr.name + "Compute');\n") +
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
        return attrs.length ? "\n" + (TAB + attrs.join(",\n" + TAB)) + "\n" : '';
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
            return new SortedPair(Number.MAX_VALUE, detailHasMany.name + ": hasMany('" + detailHasMany.relatedTo + "', '" + detailHasMany.caption + "', {\n" + indentStr + attrsStr + "\n" + indentStr2 + "})");
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
        return new SortedPair(index, belongsTo.name + ": belongsTo('" + belongsTo.relatedTo + "', '" + belongsTo.caption + "', {\n" + indentStr + attrsStr + "\n" + indentStr2 + "}" + hiddenStr + ")");
    };
    ModelBlueprint.prototype.declareProjAttr = function (attr) {
        var hiddenStr = "";
        if (attr.hidden) {
            hiddenStr = ", { hidden: true }";
        }
        return new SortedPair(attr.index, attr.name + ": attr('" + attr.caption + "'" + hiddenStr + ")");
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
                projAttrs.push(new SortedPair(Number.MAX_VALUE, hasMany.name + ": hasMany('" + hasMany.relatedTo + "', '" + hasMany.caption + "', {\n      " + attrsStr_1 + "\n    })"));
            }
            projAttrs = lodash.sortBy(projAttrs, ["index"]);
            var attrsStr = lodash.map(projAttrs, "str").join(",\n    ");
            projections.push("  modelClass.defineProjection('" + proj.name + "', '" + proj.modelName + "', {\n    " + attrsStr + "\n  });");
        }
        return "\n" + projections.join("\n\n") + "\n";
    };
    ModelBlueprint.prototype.getValidations = function (model) {
        var validators = {};
        for (var _i = 0, _a = model.attrs; _i < _a.length; _i++) {
            var attr = _a[_i];
            validators[attr.name] = ["validator('ds-error'),"];
            switch (attr.type) {
                case 'date':
                    validators[attr.name].push("validator('date'),");
                    if (attr.notNull) {
                        validators[attr.name].push("validator('presence', true),");
                    }
                    break;
                case 'string':
                case 'boolean':
                    if (attr.notNull) {
                        validators[attr.name].push("validator('presence', true),");
                    }
                    break;
                case 'number':
                case 'decimal':
                    var options = 'allowString: true';
                    options += attr.notNull ? '' : ', allowBlank: true';
                    options += attr.type === 'number' ? ', integer: true' : '';
                    validators[attr.name].push("validator('number', { " + options + " }),");
                    break;
            }
        }
        for (var _b = 0, _c = model.belongsTo; _b < _c.length; _b++) {
            var belongsTo = _c[_b];
            validators[belongsTo.name] = ["validator('ds-error'),", "validator('belongs-to'),"];
            if (belongsTo.presence) {
                validators[belongsTo.name].push("validator('presence', true),");
            }
        }
        for (var _d = 0, _e = model.hasMany; _d < _e.length; _d++) {
            var hasMany = _e[_d];
            validators[hasMany.name] = ["validator('ds-error'),", "validator('has-many'),"];
        }
        var validations = [];
        for (var validationKey in validators) {
            var descriptionKey = "descriptionKey: 'models." + model.modelName + ".validations." + validationKey + ".__caption__',";
            var _validators = "validators: [\n" + (TAB + TAB + TAB + validators[validationKey].join("\n" + (TAB + TAB + TAB))) + "\n" + (TAB + TAB) + "],";
            validations.push((TAB + validationKey) + ": {\n" + (TAB + TAB + descriptionKey) + "\n" + (TAB + TAB + _validators) + "\n" + TAB + "}");
        }
        return validations.length ? "\n" + validations.join(',\n') + ",\n" : '';
    };
    return ModelBlueprint;
}());
exports.default = ModelBlueprint;
//# sourceMappingURL=ModelBlueprint.js.map
