"use strict";
/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
var stripBom = require("strip-bom");
var skipConfirmationFunc = require('../utils/skip-confirmation');
var fs = require("fs");
var path = require("path");
var lodash = require("lodash");
var Locales_1 = require("../flexberry-core/Locales");
var CommonUtils_1 = require("../flexberry-common/CommonUtils");
var ModelBlueprint_1 = require("../flexberry-model/ModelBlueprint");
var componentMaps = [
    { name: "flexberry-file", types: ["file"] },
    { name: "flexberry-checkbox", types: ["boolean"] },
    { name: "flexberry-simpledatetime", types: ["date"] },
    { name: "flexberry-field", types: ["string", "number", "decimal"] }
];
module.exports = {
    description: 'Generates an ember edit-form for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean }
    ],
    supportsAddon: function () {
        return false;
    },
    _files: null,
    isDummy: false,
    files: function () {
        if (this._files) {
            return this._files;
        }
        this.isDummy = this.options.dummy;
        if (this.options.dummy) {
            this._files = CommonUtils_1.default.getFilesForGeneration(this, function (v) { return v === "app/templates/__name__.hbs"; });
        }
        else {
            this._files = CommonUtils_1.default.getFilesForGeneration(this, function (v) { return v === "tests/dummy/app/templates/__name__.hbs"; });
        }
        return this._files;
    },
    afterInstall: function (options) {
        if (this.project.isEmberCLIAddon()) {
            CommonUtils_1.default.installFlexberryAddon(options, ["controller", "route"]);
            CommonUtils_1.default.installReexportNew(options, ["controller", "route"]);
        }
    },
    processFiles: function (intoDir, templateVariables) {
        var skipConfirmation = this.options.skipConfirmation;
        if (skipConfirmation) {
            return skipConfirmationFunc(this, intoDir, templateVariables);
        }
        return this._super.apply(this, arguments);
    },
    /**
     * Blueprint Hook locals.
     * Use locals to add custom template variables. The method receives one argument: options.
     *
     * @method locals
     * @public
     *
     * @param {Object} options Options is an object containing general and entity-specific options.
     * @return {Object} Сustom template variables.
     */
    locals: function (options) {
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        var editFormBlueprint = new EditFormBlueprint(this, options);
        return lodash.defaults({
            modelName: editFormBlueprint.editForm.projections[0].modelName,
            modelProjection: editFormBlueprint.editForm.projections[0].modelProjection,
            formName: editFormBlueprint.editForm.name,
            entityName: options.entity.name,
            caption: editFormBlueprint.editForm.caption,
            parentRoute: editFormBlueprint.parentRoute,
            flexberryComponents: editFormBlueprint.flexberryComponents,
            functionGetCellComponent: editFormBlueprint.functionGetCellComponent,
        }, editFormBlueprint.locales.getLodashVariablesProperties() // for use in files\__root__\locales\**\forms\__name__.js
        );
    }
};
var EditFormBlueprint = /** @class */ (function () {
    function EditFormBlueprint(blueprint, options) {
        this.snippetsResult = [];
        this._tmpSnippetsResult = [];
        this.blueprint = blueprint;
        this.options = options;
        this.modelsDir = path.join(options.metadataDir, "models");
        var localePathTemplate = this.getLocalePathTemplate(options, blueprint.isDummy, path.join("forms", options.entity.name + ".js"));
        this.locales = new Locales_1.default(options.entity.name, "ru", localePathTemplate);
        this.process();
        this.flexberryComponents = this.snippetsResult.join("\n");
        this.parentRoute = this.getParentRoute();
        var bodySwitchBindingPath = [];
        var propertyLookup;
        for (var _i = 0, _a = this.editForm.propertyLookup; _i < _a.length; _i++) {
            propertyLookup = _a[_i];
            if (!propertyLookup.master)
                continue;
            var snippet = this.readSnippetFile("getCellComponent-flexberry-lookup", "js");
            bodySwitchBindingPath.push(lodash.template(snippet)(propertyLookup));
        }
        if (bodySwitchBindingPath.length > 0) {
            var snippet = this.readSnippetFile("getCellComponent-function", "js");
            this.functionGetCellComponent = lodash.template(snippet)({ bodySwitchBindingPath: bodySwitchBindingPath.join("\n") });
            this.functionGetCellComponent = lodash.trimEnd(this.functionGetCellComponent, "\n");
        }
        else {
            this.functionGetCellComponent = null;
        }
    }
    EditFormBlueprint.prototype.readSnippetFile = function (fileName, fileExt) {
        return stripBom(fs.readFileSync(path.join(this.blueprint.path, "snippets", fileName + "." + fileExt), "utf8"));
    };
    EditFormBlueprint.prototype.readHbsSnippetFile = function (componentName) {
        return this.readSnippetFile(componentName, "hbs");
    };
    EditFormBlueprint.prototype.loadModel = function (modelName) {
        var model = ModelBlueprint_1.default.loadModel(this.modelsDir, modelName + ".json");
        return model;
    };
    EditFormBlueprint.prototype.findAttr = function (model, attrName) {
        var modelAttr = lodash.find(model.attrs, function (attr) { return attr.name === attrName; });
        if (!modelAttr) {
            model = this.loadModel(model.parentModelName);
            return this.findAttr(model, attrName);
        }
        return modelAttr;
    };
    EditFormBlueprint.prototype.loadSnippet = function (model, attrName) {
        var modelAttr = this.findAttr(model, attrName);
        var component = lodash.find(componentMaps, function (map) { return lodash.indexOf(map.types, modelAttr.type) !== -1; });
        if (!component) {
            return this.readHbsSnippetFile("flexberry-dropdown");
        }
        return this.readHbsSnippetFile(component.name);
    };
    EditFormBlueprint.prototype.process = function () {
        var editFormsDir = path.join(this.options.metadataDir, "edit-forms");
        var editFormsFile = path.join(editFormsDir, this.options.file);
        var content = stripBom(fs.readFileSync(editFormsFile, "utf8"));
        this.editForm = JSON.parse(content);
        this.locales.setupForm(this.editForm);
        var linkProj = this.editForm.projections[0];
        var model = this.loadModel(linkProj.modelName);
        var proj = lodash.find(model.projections, function (pr) { return pr.name === linkProj.modelProjection; });
        var projAttr;
        for (var _i = 0, _a = proj.attrs; _i < _a.length; _i++) {
            projAttr = _a[_i];
            this.locales.setupEditFormAttribute(projAttr);
            if (projAttr.hidden || projAttr.index === -1) {
                continue;
            }
            var snippet = this.loadSnippet(model, projAttr.name);
            var attr = this.findAttr(model, projAttr.name);
            projAttr.readonly = "readonly";
            projAttr.type = attr.type;
            projAttr.entityName = this.options.entity.name;
            projAttr.dashedName = (projAttr.name || '').replace(/\./g, '-');
            this.calculateValidatePropertyNames(projAttr);
            this._tmpSnippetsResult.push({ index: projAttr.index, snippetResult: lodash.template(snippet)(projAttr) });
        }
        this.fillBelongsToAttrs(proj.belongsTo, []);
        var belongsTo, hasMany;
        for (var _b = 0, _c = proj.belongsTo; _b < _c.length; _b++) {
            belongsTo = _c[_b];
            this.locales.setupEditFormAttribute(belongsTo);
            if (belongsTo.hidden || belongsTo.index === -1) {
                continue;
            }
            var propertyLookup = lodash.find(this.editForm.propertyLookup, function (propLookup) { return propLookup.relationName === belongsTo.relationName; });
            if (propertyLookup) {
                belongsTo.projection = propertyLookup.projection;
                belongsTo.readonly = "readonly";
                belongsTo.entityName = this.options.entity.name;
                belongsTo.dashedName = (belongsTo.name || '').replace(/\./g, '-');
                this.calculateValidatePropertyNames(belongsTo);
                this._tmpSnippetsResult.push({ index: belongsTo.index, snippetResult: lodash.template(this.readHbsSnippetFile("flexberry-lookup"))(belongsTo) });
            }
        }
        this._tmpSnippetsResult = lodash.sortBy(this._tmpSnippetsResult, ["index"]);
        this.snippetsResult = lodash.map(this._tmpSnippetsResult, "snippetResult");
        for (var _d = 0, _e = proj.hasMany; _d < _e.length; _d++) {
            hasMany = _e[_d];
            hasMany.readonly = "readonly";
            hasMany.entityName = this.options.entity.name;
            hasMany.dashedName = (hasMany.name || '').replace(/\./g, '-');
            this.locales.setupEditFormAttribute(hasMany);
            this.calculateValidatePropertyNames(hasMany);
            this.snippetsResult.push(lodash.template(this.readHbsSnippetFile("flexberry-groupedit"))(hasMany));
        }
    };
    EditFormBlueprint.prototype.fillBelongsToAttrs = function (belongsToArray, parentPath) {
        for (var _i = 0, belongsToArray_1 = belongsToArray; _i < belongsToArray_1.length; _i++) {
            var belongsTo = belongsToArray_1[_i];
            var currentPath = lodash.concat(parentPath, belongsTo.name);
            var belongsToAttr = void 0;
            for (var _a = 0, _b = belongsTo.attrs; _a < _b.length; _a++) {
                belongsToAttr = _b[_a];
                if (belongsToAttr.hidden || belongsToAttr.index === -1) {
                    continue;
                }
                var model = this.loadModel(belongsTo.relatedTo);
                var snippet = this.loadSnippet(model, belongsToAttr.name);
                var attr = this.findAttr(model, belongsToAttr.name);
                belongsToAttr.name = lodash.concat(currentPath, belongsToAttr.name).join(".");
                belongsToAttr.readonly = "true";
                belongsToAttr.type = attr.type;
                belongsToAttr.entityName = this.options.entity.name;
                belongsToAttr.dashedName = (belongsToAttr.name || '').replace(/\./g, '-');
                this.locales.setupEditFormAttribute(belongsToAttr);
                this.calculateValidatePropertyNames(belongsToAttr);
                this._tmpSnippetsResult.push({ index: belongsToAttr.index, snippetResult: lodash.template(snippet)(belongsToAttr) });
            }
            this.fillBelongsToAttrs(belongsTo.belongsTo, currentPath);
        }
    };
    EditFormBlueprint.prototype.getParentRoute = function () {
        var parentRoute = '';
        var listFormsDir = path.join(this.options.metadataDir, "list-forms");
        var listForms = fs.readdirSync(listFormsDir);
        for (var _i = 0, listForms_1 = listForms; _i < listForms_1.length; _i++) {
            var form = listForms_1[_i];
            var pp = path.parse(form);
            if (pp.ext != ".json")
                continue;
            var listFormFile = path.join(listFormsDir, form);
            var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
            var listForm = JSON.parse(content);
            if (this.options.entity.name === listForm.editForm) {
                parentRoute = pp.name;
            }
        }
        return parentRoute;
    };
    EditFormBlueprint.prototype.getLocalePathTemplate = function (options, isDummy, localePathSuffix) {
        var targetRoot = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
        }
        return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
    };
    EditFormBlueprint.prototype.calculateValidatePropertyNames = function (attrs) {
        var name = attrs.name;
        var lastDotIndex = name.lastIndexOf(".");
        var isHaveMaster = lastDotIndex > 0 && lastDotIndex < (name.length - 1);
        attrs.propertyMaster = (isHaveMaster) ? "." + name.substring(0, lastDotIndex) : "";
        attrs.propertyName = (isHaveMaster) ? name.substring(lastDotIndex + 1, name.length) : name;
    };
    return EditFormBlueprint;
}());
//# sourceMappingURL=index.js.map
