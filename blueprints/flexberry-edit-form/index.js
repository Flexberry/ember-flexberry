"use strict";
/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
let stripBom = require("strip-bom");
let skipConfirmationFunc = require('../utils/skip-confirmation');
let fs = require("fs");
let path = require("path");
let lodash = require("lodash");
let Locales_1 = require("../flexberry-core/Locales");
let CommonUtils_1 = require("../flexberry-common/CommonUtils");
let ModelBlueprint_1 = require("../flexberry-model/ModelBlueprint");
let componentMaps = [
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
        let skipConfirmation = this.options.skipConfirmation;
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
        let editFormBlueprint = new EditFormBlueprint(this, options);
        return lodash.defaults({
            modelName: editFormBlueprint.editForm.projections[0].modelName,
            modelProjection: editFormBlueprint.editForm.projections[0].modelProjection,
            formName: editFormBlueprint.editForm.name,
            entityName: options.entity.name,
            caption: editFormBlueprint.editForm.caption,
            parentRoute: editFormBlueprint.parentRoute,
            flexberryComponents: editFormBlueprint.flexberryComponents,
            functionGetCellComponent: editFormBlueprint.functionGetCellComponent,
            isEmberCpValidationsUsed: editFormBlueprint.isEmberCpValidationsUsed,
        }, editFormBlueprint.locales.getLodashVariablesProperties() // for use in files\__root__\locales\**\forms\__name__.js
        );
    }
};
let EditFormBlueprint = /** @class */ (function () {
    function EditFormBlueprint(blueprint, options) {
        this.snippetsResult = [];
        this._tmpSnippetsResult = [];
        this.isEmberCpValidationsUsed = true;
        this.blueprint = blueprint;
        this.options = options;
        this.modelsDir = path.join(options.metadataDir, "models");
        let localePathTemplate = this.getLocalePathTemplate(options, blueprint.isDummy, path.join("forms", options.entity.name + ".js"));
        this.locales = new Locales_1.default(options.entity.name, "ru", localePathTemplate);
        this.process();
        this.flexberryComponents = this.snippetsResult.join("\n");
        this.parentRoute = this.getParentRoute();
        let bodySwitchBindingPath = [];
        let propertyLookup;
        for (let _i = 0, _a = this.editForm.propertyLookup; _i < _a.length; _i++) {
            propertyLookup = _a[_i];
            if (!propertyLookup.master)
                continue;
            let snippet = this.readSnippetFile("getCellComponent-flexberry-lookup", "js");
            bodySwitchBindingPath.push(lodash.template(snippet)(propertyLookup));
        }
        if (bodySwitchBindingPath.length > 0) {
            let snippet = this.readSnippetFile("getCellComponent-function", "js");
            this.functionGetCellComponent = lodash.template(snippet)({ bodySwitchBindingPath: bodySwitchBindingPath.join("\n") });
            this.functionGetCellComponent = lodash.trimEnd(this.functionGetCellComponent, "\n");
        }
        else {
            this.functionGetCellComponent = null;
        }
    }
    EditFormBlueprint.prototype.readSnippetFile = function (fileName, fileExt) {
        let snippetsFolder = this.isEmberCpValidationsUsed ? "ember-cp-validations" : "ember-validations";
        return stripBom(fs.readFileSync(path.join(this.blueprint.path, "snippets", snippetsFolder, fileName + "." + fileExt), "utf8"));
    };
    EditFormBlueprint.prototype.readHbsSnippetFile = function (componentName) {
        return this.readSnippetFile(componentName, "hbs");
    };
    EditFormBlueprint.prototype.loadModel = function (modelName) {
        let model = ModelBlueprint_1.default.loadModel(this.modelsDir, modelName + ".json");
        return model;
    };
    EditFormBlueprint.prototype.findAttr = function (model, attrName) {
        let modelAttr = lodash.find(model.attrs, function (attr) { return attr.name === attrName; });
        if (!modelAttr) {
            model = this.loadModel(model.parentModelName);
            return this.findAttr(model, attrName);
        }
        return modelAttr;
    };
    EditFormBlueprint.prototype.loadSnippet = function (model, attrName) {
        let modelAttr = this.findAttr(model, attrName);
        let component = lodash.find(componentMaps, function (map) { return lodash.indexOf(map.types, modelAttr.type) !== -1; });
        if (!component) {
            return this.readHbsSnippetFile("flexberry-dropdown");
        }
        return this.readHbsSnippetFile(component.name);
    };
    EditFormBlueprint.prototype.process = function () {
        let editFormsDir = path.join(this.options.metadataDir, "edit-forms");
        let editFormsFile = path.join(editFormsDir, this.options.file);
        let content = stripBom(fs.readFileSync(editFormsFile, "utf8"));
        this.editForm = JSON.parse(content);
        this.locales.setupForm(this.editForm);
        let linkProj = this.editForm.projections[0];
        let model = this.loadModel(linkProj.modelName);
        let proj = lodash.find(model.projections, function (pr) { return pr.name === linkProj.modelProjection; });
        let projAttr;
        for (let _i = 0, _a = proj.attrs; _i < _a.length; _i++) {
            projAttr = _a[_i];
            this.locales.setupEditFormAttribute(projAttr);
            if (projAttr.hidden || projAttr.index === -1) {
                continue;
            }
            let snippet = this.loadSnippet(model, projAttr.name);
            let attr = this.findAttr(model, projAttr.name);
            projAttr.readonly = "readonly";
            projAttr.type = attr.type;
            projAttr.entityName = this.options.entity.name;
            projAttr.dashedName = (projAttr.name || '').replace(/\./g, '-');
            this.calculateValidatePropertyNames(projAttr);
            this._tmpSnippetsResult.push({ index: projAttr.index, snippetResult: lodash.template(snippet)(projAttr) });
        }
        this.fillBelongsToAttrs(proj.belongsTo, []);
        let belongsTo, hasMany;
        for (let _b = 0, _c = proj.belongsTo; _b < _c.length; _b++) {
            belongsTo = _c[_b];
            this.locales.setupEditFormAttribute(belongsTo);
            if (belongsTo.hidden || belongsTo.index === -1) {
                continue;
            }
            let propertyLookup = lodash.find(this.editForm.propertyLookup, function (propLookup) { return propLookup.relationName === belongsTo.relationName; });
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
        for (let _d = 0, _e = proj.hasMany; _d < _e.length; _d++) {
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
        for (let _i = 0, belongsToArray_1 = belongsToArray; _i < belongsToArray_1.length; _i++) {
            let belongsTo = belongsToArray_1[_i];
            let currentPath = lodash.concat(parentPath, belongsTo.name);
            let belongsToAttr = void 0;
            for (let _a = 0, _b = belongsTo.attrs; _a < _b.length; _a++) {
                belongsToAttr = _b[_a];
                if (belongsToAttr.hidden || belongsToAttr.index === -1) {
                    continue;
                }
                let model = this.loadModel(belongsTo.relatedTo);
                let snippet = this.loadSnippet(model, belongsToAttr.name);
                let attr = this.findAttr(model, belongsToAttr.name);
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
        let parentRoute = '';
        let listFormsDir = path.join(this.options.metadataDir, "list-forms");
        let listForms = fs.readdirSync(listFormsDir);
        for (let _i = 0, listForms_1 = listForms; _i < listForms_1.length; _i++) {
            let form = listForms_1[_i];
            let pp = path.parse(form);
            if (pp.ext != ".json")
                continue;
            let listFormFile = path.join(listFormsDir, form);
            let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
            let listForm = JSON.parse(content);
            if (this.options.entity.name === listForm.editForm) {
                parentRoute = pp.name;
            }
        }
        return parentRoute;
    };
    EditFormBlueprint.prototype.getLocalePathTemplate = function (options, isDummy, localePathSuffix) {
        let targetRoot = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
        }
        return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
    };
    EditFormBlueprint.prototype.calculateValidatePropertyNames = function (attrs) {
        let name = attrs.name;
        let lastDotIndex = name.lastIndexOf(".");
        let isHaveMaster = lastDotIndex > 0 && lastDotIndex < (name.length - 1);
        attrs.propertyMaster = (isHaveMaster) ? "." + name.substring(0, lastDotIndex) : "";
        attrs.propertyName = (isHaveMaster) ? name.substring(lastDotIndex + 1, name.length) : name;
    };
    return EditFormBlueprint;
}());
//# sourceMappingURL=index.js.map
