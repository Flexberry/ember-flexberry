"use strict";
/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
let stripBom = require("strip-bom");
let fs = require("fs");
let path = require("path");
let lodash = require("lodash");
let Locales_1 = require("../flexberry-core/Locales");
let TAB = "  ";
let SortedPair = /** @class */ (function () {
    function SortedPair(index, str) {
        this.index = index;
        this.str = str;
    }
    return SortedPair;
}());
let ModelBlueprint = /** @class */ (function () {
    function ModelBlueprint(blueprint, options) {
        this.enumImports = {};
        let modelsDir = path.join(options.metadataDir, "models");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        let model = ModelBlueprint.loadModel(modelsDir, options.file);
        this.parentModelName = model.parentModelName;
        this.parentClassName = model.parentClassName;
        if (model.parentModelName) {
            let parentModel = ModelBlueprint.loadModel(modelsDir, model.parentModelName + ".json");
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
        let localePathTemplate = this.getLocalePathTemplate(options, blueprint.isDummy, path.join("models", options.entity.name + ".js"));
        let modelLocales = new Locales_1.ModelLocales(model, modelsDir, "ru", localePathTemplate);
        this.lodashVariables = modelLocales.getLodashVariablesProperties();
        this.validations = this.getValidations(model);
    }
    ModelBlueprint.loadModel = function (modelsDir, modelFileName) {
        let modelFile = path.join(modelsDir, modelFileName);
        let content = stripBom(fs.readFileSync(modelFile, "utf8"));
        let model = JSON.parse(content);
        return model;
    };
    ModelBlueprint.loadEnums = function (metadataDir) {
        let enums = {};
        let enumsDir = path.join(metadataDir, "enums");
        let files = fs.readdirSync(enumsDir);
        for (let _i = 0, files_1 = files; _i < files_1.length; _i++) {
            let fileName = files_1[_i];
            let parsedPath = path.parse(fileName);
            if (parsedPath.ext === ".json") {
                let enumContent = fs.readFileSync(path.join(enumsDir, fileName), "utf8");
                enums[parsedPath.name] = JSON.parse(stripBom(enumContent));
            }
        }
        return enums;
    };
    ModelBlueprint.prototype.getNeedsTransforms = function (dir) {
        let list = fs.readdirSync(dir);
        let transforms = [];
        for (let _i = 0, list_1 = list; _i < list_1.length; _i++) {
            let e = list_1[_i];
            let pp = path.parse(e);
            if (pp.ext != ".json")
                continue;
            transforms.push("    'transform:" + pp.name + "'");
        }
        return transforms.join(",\n");
    };
    ModelBlueprint.prototype.getNeedsAllModels = function (modelsDir) {
        let listModels = fs.readdirSync(modelsDir);
        let models = [];
        for (let _i = 0, listModels_1 = listModels; _i < listModels_1.length; _i++) {
            let model = listModels_1[_i];
            let pp = path.parse(model);
            if (pp.ext != ".json")
                continue;
            models.push("    'model:" + pp.name + "'");
        }
        return models.join(",\n");
    };
    ModelBlueprint.prototype.getSerializerAttrs = function (model) {
        let attrs = [];
        for (let _i = 0, _a = model.belongsTo; _i < _a.length; _i++) {
            let belongsTo = _a[_i];
            attrs.push(belongsTo.name + ": { serialize: 'odata-id', deserialize: 'records' }");
        }
        for (let _b = 0, _c = model.hasMany; _b < _c.length; _b++) {
            let hasMany = _c[_b];
            attrs.push(hasMany.name + ": { serialize: false, deserialize: 'records' }");
        }
        if (attrs.length === 0) {
            return "";
        }
        return "      " + attrs.join(",\n      ");
    };
    ModelBlueprint.prototype.getOfflineSerializerAttrs = function (model) {
        let attrs = [];
        for (let _i = 0, _a = model.belongsTo; _i < _a.length; _i++) {
            let belongsTo = _a[_i];
            attrs.push(belongsTo.name + ": { serialize: 'id', deserialize: 'records' }");
        }
        for (let _b = 0, _c = model.hasMany; _b < _c.length; _b++) {
            let hasMany = _c[_b];
            attrs.push(hasMany.name + ": { serialize: 'ids', deserialize: 'records' }");
        }
        if (attrs.length === 0) {
            return "";
        }
        return "      " + attrs.join(",\n      ");
    };
    ModelBlueprint.prototype.getJSForModel = function (model) {
        let attrs = [];
        let templateBelongsTo = lodash.template("<%=name%>: DS.belongsTo('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false<%if(polymorphic){%>, polymorphic: true<%}%> })");
        let templateHasMany = lodash.template("<%=name%>: DS.hasMany('<%=relatedTo%>', { inverse: <%if(inverse){%>'<%=inverse%>'<%}else{%>null<%}%>, async: false })");
        let attr;
        for (let _i = 0, _a = model.attrs; _i < _a.length; _i++) {
            attr = _a[_i];
            let comment = "";
            if (!attr.stored) {
                comment =
                    "/**\n" +
                        TAB + TAB + "Non-stored property.\n\n" +
                        TAB + TAB + ("@property " + attr.name + "\n") +
                        TAB + "*/\n" + TAB;
            }
            let options = [];
            let optionsStr = "";
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
                        break;
                    default:
                        if (this.enums.hasOwnProperty(attr.type)) {
                            let enumName = this.enums[attr.type].className + "Enum";
                            this.enumImports[enumName] = attr.type;
                            options.push("defaultValue: " + enumName + "." + attr.defaultValue);
                        }
                        else {
                            options.push("defaultValue: '" + attr.defaultValue + "'");
                        }
                }
            }
            if (attr.ordered) {
                options.push("ordered: true");
            }
            if (options.length != 0) {
                optionsStr = ", { " + options.join(', ') + ' }';
            }
            attrs.push("" + comment + attr.name + ": DS.attr('" + attr.type + "'" + optionsStr + ")");
            if (attr.stored)
                continue;
            let methodToSetNotStoredProperty = "/**\n" +
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
                TAB + TAB + ("let result = (this." + attr.name + "Compute && typeof this." + attr.name + "Compute === 'function') ?") +
                (attr.name.length > 21 ? '\n' + TAB + TAB + TAB : ' ') + ("this." + attr.name + "Compute() : null;\n") +
                TAB + TAB + ("this.set('" + attr.name + "', result);\n") +
                TAB + "}";
            attrs.push(methodToSetNotStoredProperty);
        }
        let belongsTo;
        for (let _b = 0, _c = model.belongsTo; _b < _c.length; _b++) {
            belongsTo = _c[_b];
            attrs.push(templateBelongsTo(belongsTo));
        }
        for (let _d = 0, _e = model.hasMany; _d < _e.length; _d++) {
            let hasMany = _e[_d];
            attrs.push(templateHasMany(hasMany));
        }
        return attrs.length ? "\n" + (TAB + attrs.join(",\n" + TAB)) + "\n" : '';
    };
    ModelBlueprint.prototype.joinProjHasMany = function (detailHasMany, modelsDir, level) {
        let hasManyAttrs = [];
        let hasManyModel = ModelBlueprint.loadModel(modelsDir, detailHasMany.relatedTo + ".json");
        let hasManyProj = lodash.find(hasManyModel.projections, function (pr) { return pr.name === detailHasMany.projectionName; });
        if (hasManyProj) {
            for (let _i = 0, _a = hasManyProj.attrs; _i < _a.length; _i++) {
                let attr = _a[_i];
                hasManyAttrs.push(this.declareProjAttr(attr));
            }
            for (let _b = 0, _c = hasManyProj.belongsTo; _b < _c.length; _b++) {
                let belongsTo = _c[_b];
                hasManyAttrs.push(this.joinProjBelongsTo(belongsTo, level + 1));
            }
            let indent = [];
            for (let i = 0; i < level; i++) {
                indent.push(TAB);
            }
            let indentStr = indent.join("");
            indent.pop();
            let indentStr2 = indent.join("");
            hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
            let attrsStr = lodash.map(hasManyAttrs, "str").join(",\n" + indentStr);
            if (hasManyAttrs.length === 0) {
                attrsStr = "";
                indentStr = "";
            }
            return new SortedPair(Number.MAX_VALUE, detailHasMany.name + ": hasMany('" + detailHasMany.relatedTo + "', '" + detailHasMany.caption + "', {\n" + indentStr + attrsStr + "\n" + indentStr2 + "})");
        }
        return new SortedPair(Number.MAX_VALUE, "");
    };
    ModelBlueprint.prototype.joinProjBelongsTo = function (belongsTo, level) {
        let belongsToAttrs = [];
        let index = Number.MAX_VALUE;
        for (let _i = 0, _a = belongsTo.attrs; _i < _a.length; _i++) {
            let attr = _a[_i];
            belongsToAttrs.push(this.declareProjAttr(attr));
        }
        for (let _b = 0, _c = belongsTo.belongsTo; _b < _c.length; _b++) {
            let belongsTo2 = _c[_b];
            belongsToAttrs.push(this.joinProjBelongsTo(belongsTo2, level + 1));
        }
        let hiddenStr = "";
        if (belongsTo.hidden || belongsTo.index == -1) {
            hiddenStr = ", { index: " + belongsTo.index + ", hidden: true }";
        }
        else {
            if (belongsTo.lookupValueField) {
              hiddenStr = ", { index: " + belongsTo.index + ", displayMemberPath: '" + belongsTo.lookupValueField + "' }";
            }
            else {
              hiddenStr = ", { index: " + belongsTo.index + " }";
            }
        }
        let indent = [];
        for (let i = 0; i < level; i++) {
            indent.push(TAB);
        }
        let indentStr = indent.join("");
        indent.pop();
        let indentStr2 = indent.join("");
        belongsToAttrs = lodash.sortBy(belongsToAttrs, ["index"]);
        let attrsStr = lodash.map(belongsToAttrs, "str").join(",\n" + indentStr);
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
        let hiddenStr = "";
        if (attr.hidden) {
            hiddenStr = ", { index: " + attr.index + ", hidden: true }";
        }
        else {
            hiddenStr = ", { index: " + attr.index + " }";
        }
        return new SortedPair(attr.index, attr.name + ": attr('" + attr.caption + "'" + hiddenStr + ")");
    };
    ModelBlueprint.prototype.getJSForProjections = function (model, modelsDir) {
        let projections = [];
        let projName;
        if (model.projections.length === 0) {
            return null;
        }
        for (let _i = 0, _a = model.projections; _i < _a.length; _i++) {
            let proj = _a[_i];
            let projAttrs = [];
            for (let _b = 0, _c = proj.attrs; _b < _c.length; _b++) {
                let attr = _c[_b];
                projAttrs.push(this.declareProjAttr(attr));
            }
            for (let _d = 0, _e = proj.belongsTo; _d < _e.length; _d++) {
                let belongsTo = _e[_d];
                projAttrs.push(this.joinProjBelongsTo(belongsTo, 3));
            }
            for (let _f = 0, _g = proj.hasMany; _f < _g.length; _f++) {
                let hasMany = _g[_f];
                let hasManyAttrs = [];
                let detailModel = ModelBlueprint.loadModel(modelsDir, hasMany.relatedTo + ".json");
                projName = hasMany.projectionName;
                let detailProj = lodash.find(detailModel.projections, function (pr) { return pr.name === projName; });
                if (detailProj) {
                    for (let _h = 0, _j = detailProj.attrs; _h < _j.length; _h++) {
                        let detailAttr = _j[_h];
                        hasManyAttrs.push(this.declareProjAttr(detailAttr));
                    }
                    for (let _k = 0, _l = detailProj.belongsTo; _k < _l.length; _k++) {
                        let detailBelongsTo = _l[_k];
                        hasManyAttrs.push(this.joinProjBelongsTo(detailBelongsTo, 4));
                    }
                    for (let _m = 0, _o = detailProj.hasMany; _m < _o.length; _m++) {
                        let detailHasMany = _o[_m];
                        hasManyAttrs.push(this.joinProjHasMany(detailHasMany, modelsDir, 4));
                    }
                }
                hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
                let attrsStr_1 = lodash.map(hasManyAttrs, "str").join(",\n      ");
                projAttrs.push(new SortedPair(Number.MAX_VALUE, hasMany.name + ": hasMany('" + hasMany.relatedTo + "', '" + hasMany.caption + "', {\n      " + attrsStr_1 + "\n    })"));
            }
            projAttrs = lodash.sortBy(projAttrs, ["index"]);
            let attrsStr = lodash.map(projAttrs, "str").join(",\n    ");
            projections.push("  modelClass.defineProjection('" + proj.name + "', '" + proj.modelName + "', {\n    " + attrsStr + "\n  });");
        }
        return "\n" + projections.join("\n\n") + "\n";
    };
    ModelBlueprint.prototype.getValidations = function (model) {
        let validators = {};
        for (let _i = 0, _a = model.attrs; _i < _a.length; _i++) {
            let attr = _a[_i];
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
                    let options = 'allowString: true';
                    options += attr.notNull ? '' : ', allowBlank: true';
                    options += attr.type === 'number' ? ', integer: true' : '';
                    validators[attr.name].push("validator('number', { " + options + " }),");
                    break;
            }
        }
        for (let _b = 0, _c = model.belongsTo; _b < _c.length; _b++) {
            let belongsTo = _c[_b];
            validators[belongsTo.name] = ["validator('ds-error'),"];
            if (belongsTo.presence) {
                validators[belongsTo.name].push("validator('presence', true),");
            }
        }
        for (let _d = 0, _e = model.hasMany; _d < _e.length; _d++) {
            let hasMany = _e[_d];
            validators[hasMany.name] = ["validator('ds-error'),", "validator('has-many'),"];
        }
        let validations = [];
        for (let validationKey in validators) {
            let descriptionKey = "descriptionKey: 'models." + model.modelName + ".validations." + validationKey + ".__caption__',";
            let _validators = "validators: [\n" + (TAB + TAB + TAB + validators[validationKey].join("\n" + (TAB + TAB + TAB))) + "\n" + (TAB + TAB) + "],";
            validations.push((TAB + validationKey) + ": {\n" + (TAB + TAB + descriptionKey) + "\n" + (TAB + TAB + _validators) + "\n" + TAB + "}");
        }
        return validations.length ? "\n" + validations.join(',\n') + ",\n" : '';
    };
    ModelBlueprint.prototype.getLocalePathTemplate = function (options, isDummy, localePathSuffix) {
        let targetRoot = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
        }
        return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
    };
    return ModelBlueprint;
}());
exports.default = ModelBlueprint;
//# sourceMappingURL=ModelBlueprint.js.map
