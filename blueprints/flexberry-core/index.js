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
let ModelBlueprint_1 = require("../flexberry-model/ModelBlueprint");
let CommonUtils_1 = require("../flexberry-common/CommonUtils");
let TAB = "  ";
const skipConfirmationFunc = require('../utils/skip-confirmation');
module.exports = {
    description: 'Generates core entities for flexberry.',
    availableOptions: [
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean }
    ],
    supportsAddon: function () {
        return false;
    },
    _files: null,
    _generateOnce: [
        '.jscsrc',

        //'__root__/app.js',
        //'__root__/templates/application.hbs',

        '__root__/templates/mobile/application.hbs',
    ],
    getFileMap: function () {
        let moduleName = this.options.entity && this.options.entity.name || this.packageName;
        let fileMapVariables = this._generateFileMapVariables(moduleName, null, this.options);
        return this.generateFileMap(fileMapVariables);
    },
    getTargetFile: function (file, fileMap) {
        if (fileMap === void 0) { fileMap = null; }
        if (!fileMap) {
            fileMap = this.getFileMap();
        }
        let targetFile = String(file);
        for (let _i = 0, _a = lodash.keys(fileMap); _i < _a.length; _i++) {
            let i = _a[_i];
            let pattern = new RegExp(i, 'g');
            targetFile = targetFile.replace(pattern, fileMap[i]);
        }
        return targetFile;
    },
    isDummy: false,
    files: function () {
        if (this._files) {
            return this._files;
        }
        this.isDummy = this.options.dummy;
        let sitemapFile = path.join(this.options.metadataDir, "application", "sitemap.json");
        let sitemap = JSON.parse(stripBom(fs.readFileSync(sitemapFile, "utf8")));
        if (this.project.isEmberCLIAddon() && !this.options.dummy) {
            if (sitemap.mobile) {
                this._files = CommonUtils_1.default.getFilesForGeneration(this, function (v) { return v === "__root__/locales/en/translations.js" || v === "__root__/locales/ru/translations.js"; });
            }
            else {
                this._files = CommonUtils_1.default.getFilesForGeneration(this, function (v) { return v === "__root__/templates/mobile/application.hbs" || v === "__root__/locales/en/translations.js" || v === "__root__/locales/ru/translations.js"; });
            }
        }
        else {
            if (sitemap.mobile) {
                this._files = CommonUtils_1.default.getFilesForGeneration(this, function (v) { return v === "addon/locales/en/translations.js" || v === "addon/locales/ru/translations.js"; });
            }
            else {
                this._files = CommonUtils_1.default.getFilesForGeneration(this, function (v) { return v === "__root__/templates/mobile/application.hbs" || v === "addon/locales/en/translations.js" || v === "addon/locales/ru/translations.js"; });
            }
        }
        if (this.project.isEmberCLIAddon() || this.options.dummy) {
            lodash.remove(this._files, function (v) { return v === "public/assets/images/cat.gif" || v === "public/assets/images/favicon.ico" || v === "public/assets/images/flexberry-logo.png"; });
        }
        else {
            lodash.remove(this._files, function (fileName) { return fileName.indexOf("tests/dummy/") === 0; });
        }
        this._excludeIfExists();
        return this._files;
    },

    processFiles(intoDir, templateVariables) {
        let skipConfirmation = this.options.skipConfirmation;
        if (skipConfirmation) {
            return skipConfirmationFunc(this, intoDir, templateVariables);
        }

        return this._super(...arguments);
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
        let projectTypeNameCamel = "App";
        let projectTypeNameCebab = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            options.dummy = true;
            projectTypeNameCamel = "Addon";
            projectTypeNameCebab = "addon";
        }
        let coreBlueprint = new CoreBlueprint(this, options);
        return lodash.defaults({
            projectName: this.project.pkg.name,
            children: coreBlueprint.children,
            routes: coreBlueprint.routes,
            importProperties: coreBlueprint.importProperties,
            formsImportedProperties: coreBlueprint.formsImportedProperties,
            modelsImportedProperties: coreBlueprint.modelsImportedProperties,
            applicationCaption: coreBlueprint.sitemap.applicationCaption,
            applicationTitle: coreBlueprint.sitemap.applicationTitle,
            projectTypeNameCamel: projectTypeNameCamel,
            projectTypeNameCebab: projectTypeNameCebab // for use in files\ember-cli-build.js
        }, coreBlueprint.lodashVariablesApplicationMenu // for use in files\__root__\locales\**\translations.js
        );
    },
    _excludeIfExists: function () {
        let fileMap = this.getFileMap();
        let checkIfExists = lodash.intersection(this._files, this._generateOnce);
        let _loop_1 = function (file) {
            let targetFile = this_1.getTargetFile(file, fileMap);
            if (fs.existsSync(targetFile)) {
                lodash.remove(this_1._files, function (v) { return v === file; });
            }
        };
        let this_1 = this;
        for (let _i = 0, checkIfExists_1 = checkIfExists; _i < checkIfExists_1.length; _i++) {
            let file = checkIfExists_1[_i];
            _loop_1(file);
        }
    }
};
let CoreBlueprint = /** @class */ (function () {
    function CoreBlueprint(blueprint, options) {
        let listFormsDir = path.join(options.metadataDir, "list-forms");
        let listForms = fs.readdirSync(listFormsDir);
        let editFormsDir = path.join(options.metadataDir, "edit-forms");
        let editForms = fs.readdirSync(editFormsDir);
        let modelsDir = path.join(options.metadataDir, "models");
        let models = fs.readdirSync(modelsDir);
        let sitemapFile = path.join(options.metadataDir, "application", "sitemap.json");
        let children = [];
        let routes = [];
        let importProperties = [];
        let formsImportedProperties = [];
        let modelsImportedProperties = [];
        for (let _i = 0, listForms_1 = listForms; _i < listForms_1.length; _i++) {
            let formFileName = listForms_1[_i];
            let pp = path.parse(formFileName);
            if (pp.ext != ".json")
                continue;
            let listFormFile = path.join(listFormsDir, formFileName);
            let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
            let listForm = JSON.parse(content);
            if (listForm.external)
                continue;
            let listFormName = pp.name;
            routes.push("  this.route('" + listFormName + "');");
            routes.push("  this.route('" + listForm.editForm + "',\n  { path: '" + listForm.editForm + "/:id' });");
            routes.push("  this.route('" + listForm.newForm + ".new',\n  { path: '" + listForm.newForm + "/new' });");
            importProperties.push("import " + listForm.name + "Form from './forms/" + listFormName + "';");
            formsImportedProperties.push("    '" + listFormName + "': " + listForm.name + "Form");
        }
        for (let _a = 0, editForms_1 = editForms; _a < editForms_1.length; _a++) {
            let formFileName = editForms_1[_a];
            let pp = path.parse(formFileName);
            if (pp.ext != ".json")
                continue;
            let editFormFile = path.join(editFormsDir, formFileName);
            let content = stripBom(fs.readFileSync(editFormFile, "utf8"));
            let editForm = JSON.parse(content);
            if (editForm.external)
                continue;
            let editFormName = pp.name;
            importProperties.push("import " + editForm.name + "Form from './forms/" + editFormName + "';");
            formsImportedProperties.push("    '" + editFormName + "': " + editForm.name + "Form");
        }
        for (let _b = 0, models_1 = models; _b < models_1.length; _b++) {
            let modelFileName = models_1[_b];
            let pp = path.parse(modelFileName);
            if (pp.ext != ".json")
                continue;
            let model = ModelBlueprint_1.default.loadModel(modelsDir, modelFileName);
            if (model.external)
                continue;
            let modelName = pp.name;
            importProperties.push("import " + model.name + "Model from './models/" + modelName + "';");
            modelsImportedProperties.push("    '" + modelName + "': " + model.name + "Model");
        }

        this.sitemap = JSON.parse(stripBom(fs.readFileSync(sitemapFile, "utf8")));
        let localePathTemplate = this.getLocalePathTemplate(options, blueprint.isDummy, "translations.js");
        let applicationMenuLocales = new Locales_1.ApplicationMenuLocales("ru", localePathTemplate);
        for (let _c = 0, _d = this.sitemap.items; _c < _d.length; _c++) {
            let item = _d[_c];
            let childItemExt = new SitemapItemExt(item);
            childItemExt.process("forms.application.sitemap", 5);
            applicationMenuLocales.push(childItemExt.translation, childItemExt.translationOtherLocales);
            children.push(childItemExt.sitemap);
        }
        this.lodashVariablesApplicationMenu = applicationMenuLocales.getLodashVariablesWithSuffix("ApplicationMenu", 4);
        this.children = children.join(", ");
        this.routes = routes.join("\n");
        this.importProperties = importProperties.join("\n");
        this.formsImportedProperties = formsImportedProperties.join(",\n");
        this.modelsImportedProperties = modelsImportedProperties.join(",\n");
    }
    CoreBlueprint.prototype.getLocalePathTemplate = function (options, isDummy, localePathSuffix) {
        let targetRoot = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
        }
        return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
    };
    return CoreBlueprint;
}());
let SitemapItemExt = /** @class */ (function () {
    function SitemapItemExt(baseItem) {
        this.baseItem = baseItem;
    }
    SitemapItemExt.prototype.process = function (parentTranslationProp, level) {
        let translationProp;
        let translationName;
        if (this.baseItem.menuName) {
            translationName = this.baseItem.menuName;
        }
        else {
            translationName = this.baseItem.link;
        }

        let nodeIcon;
        if (this.baseItem.link !== null) {
            let icons = ['list', 'archive', 'phone', 'address card', 'book', 'calendar', 'building',
                'briefcase', 'chart bar', 'chart line', 'edit', 'file', 'folder', 'paperclip', 'folder open', 'suitcase', 'tasks', 'tags', 'table'];
            let randomIndex = Math.floor(Math.random() * (icons.length + 1));
            nodeIcon = icons[randomIndex];
        }

        translationProp = parentTranslationProp + "." + translationName;
        let childrenTranslation = [];
        let childrenTranslationOtherLocales = [];
        let sitemap = [];
        if (this.baseItem.children) {
            for (let _i = 0, _a = this.baseItem.children; _i < _a.length; _i++) {
                let childItem = _a[_i];
                let childItemExt = new SitemapItemExt(childItem);
                childItemExt.process(translationProp, level + 1);
                childrenTranslation.push(childItemExt.translation);
                childrenTranslationOtherLocales.push(childItemExt.translationOtherLocales);
                sitemap.push(childItemExt.sitemap);
            }
        }
        let indent = [];
        for (let i = 0; i < level; i++) {
            indent.push(TAB);
        }
        let indentStr = indent.join("");
        indent.pop();
        let indentStr2 = indent.join("");
        let childrenStr = "";
        let sitemapChildrenStr = "null";
        let childrenOtherLocalesStr = "";
        if (childrenTranslation.length > 0) {
            childrenStr = childrenTranslation.join(",\n");
            childrenOtherLocalesStr = childrenTranslationOtherLocales.join(",\n");
            sitemapChildrenStr = "[" + sitemap.join(", ") + "]";
        }
        this.translation = "" + indentStr2 + this.quote(translationName) + ": {\n" + indentStr + "caption: '" + this.escapeValue(this.baseItem.caption) + "',\n" +
            (indentStr + "title: '" + this.escapeValue(this.baseItem.title) + "',\n" + childrenStr + "\n" + indentStr2 + "}");
        this.translationOtherLocales = "" + indentStr2 + this.quote(translationName) + ": {\n" + indentStr + "caption: '" + this.escapeValue(translationName) + "',\n" +
            (indentStr + "title: '" + this.escapeValue(translationName) + "',\n" + childrenOtherLocalesStr + "\n" + indentStr2 + "}");
        let INDENT = "";
        this.sitemap = "{\n" + INDENT + indentStr + "link: " + this.quoteIfNotNull(this.baseItem.link) + ",\n" +
            (level > 5 ? '' : ("" + INDENT + indentStr + "icon: 'list',\n")) +
            ("" + INDENT + indentStr + "caption: i18n.t('" + translationProp + ".caption'),\n") +
            ("" + INDENT + indentStr + "title: i18n.t('" + translationProp + ".title'),\n") +
            (nodeIcon === undefined ? '' : ("" + INDENT + indentStr + "icon: " + this.quoteIfNotNull(nodeIcon) + ",\n")) +
            ("" + INDENT + indentStr + "children: " + sitemapChildrenStr + "\n" + INDENT + indentStr2 + "}");
    };
    SitemapItemExt.prototype.escapeValue = function (value) {
        return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    };
    SitemapItemExt.prototype.quote = function (propName) {
        if (propName.indexOf("-") == -1)
            return propName;
        return "'" + propName + "'";
    };
    SitemapItemExt.prototype.quoteIfNotNull = function (str) {
        if (str)
            return "'" + str + "'";
        return "null";
    };
    return SitemapItemExt;
}());
//# sourceMappingURL=index.js.map
