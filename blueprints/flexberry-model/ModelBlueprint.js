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
var SortedPair = /** @class */ (function () {
    function SortedPair(index, str) {
        this.index = index;
        this.str = str;
    }
    return SortedPair;
}());
var ModelBlueprint = /** @class */ (function () {
    function ModelBlueprint(blueprint, options) {
        this.enumImports = {};
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
        var localePathTemplate = this.getLocalePathTemplate(options, blueprint.isDummy, path.join("models", options.entity.name + ".js"));
        var modelLocales = new Locales_1.ModelLocales(model, modelsDir, "ru", localePathTemplate);
        this.lodashVariables = modelLocales.getLodashVariablesProperties();
    }
    ModelBlueprint.loadModel = function (modelsDir, modelFileName) {
        var modelFile = path.join(modelsDir, modelFileName);
        var content = stripBom(fs.readFileSync(modelFile, "utf8"));
        var model = JSON.parse(content);
        return model;
    };
    ModelBlueprint.loadEnums = function (metadataDir) {
        var enums = {};
        var enumsDir = path.join(metadataDir, "enums");
        var files = fs.readdirSync(enumsDir);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var fileName = files_1[_i];
            var parsedPath = path.parse(fileName);
            if (parsedPath.ext === ".json") {
                var enumContent = fs.readFileSync(path.join(enumsDir, fileName), "utf8");
                enums[parsedPath.name] = JSON.parse(stripBom(enumContent));
            }
        }
        return enums;
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
        var attrs = [], validations = [];
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
            var options = [];
            var optionsStr = "";
            if (attr.defaultValue) {
                switch (attr.type) {
                    case 'decimal':
                    case 'number':
                    case 'boolean':
                        options.push("defaultValue: " + attr.defaultValue);
                        break;
                    case 'date':
                        if (attr.defaultValue === 'Now') {
                            options.push("defaultValue() { return new Date(); }");
                            break;
                        }
                    default:
                        if (this.enums.hasOwnProperty(attr.type)) {
                            var enumName = this.enums[attr.type].className + "Enum";
                            this.enumImports[enumName] = attr.type;
                            options.push("defaultValue: " + enumName + "." + attr.defaultValue);
                        }
                        else {
                            options.push("defaultValue: '" + attr.defaultValue + "'");
                        }
                }
            }
            if (attr.order) {
                options.push("order: true");
            }
            if (options.length != 0) {
                optionsStr = ", { " + options.join(', ') + ' }';
            }
            attrs.push("" + comment + attr.name + ": DS.attr('" + attr.type + "'" + optionsStr + ")");
            if (attr.notNull) {
                if (attr.type === "date") {
                    validations.push(attr.name + ": { datetime: true }");
                }
                else {
                    validations.push(attr.name + ": { presence: true }");
                }
            }
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
                TAB + TAB + ("let result = (this." + attr.name + "Compute && typeof this." + attr.name + "Compute === 'function') ?") +
                (attr.name.length > 21 ? '\n' + TAB + TAB + TAB : ' ') + ("this." + attr.name + "Compute() : null;\n") +
                TAB + TAB + ("this.set('" + attr.name + "', result);\n") +
                TAB + "}";
            attrs.push(methodToSetNotStoredProperty);
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
        validationsFunc =
            "getValidations: function () {\n" +
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
    ModelBlueprint.prototype.getLocalePathTemplate = function (options, isDummy, localePathSuffix) {
        var targetRoot = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
        }
        return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
    };
    return ModelBlueprint;
}());
exports.default = ModelBlueprint;
//# sourceMappingURL=ModelBlueprint.js.map
