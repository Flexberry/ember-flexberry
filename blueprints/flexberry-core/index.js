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
var ModelBlueprint_1 = require("../flexberry-model/ModelBlueprint");
var CommonUtils_1 = require("../flexberry-common/CommonUtils");
var TAB = "  ";
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
        var moduleName = this.options.entity && this.options.entity.name || this.packageName;
        var fileMapVariables = this._generateFileMapVariables(moduleName, null, this.options);
        return this.generateFileMap(fileMapVariables);
    },
    getTargetFile: function (file, fileMap) {
        if (fileMap === void 0) { fileMap = null; }
        if (!fileMap) {
            fileMap = this.getFileMap();
        }
        var targetFile = String(file);
        for (var _i = 0, _a = lodash.keys(fileMap); _i < _a.length; _i++) {
            var i = _a[_i];
            var pattern = new RegExp(i, 'g');
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
        var sitemapFile = path.join(this.options.metadataDir, "application", "sitemap.json");
        var sitemap = JSON.parse(stripBom(fs.readFileSync(sitemapFile, "utf8")));
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
            lodash.remove(this._files, function (v) { return v === "test/dummy/public/assets/images/cat.gif" || v === "test/dummy/public/assets/images/favicon.ico" || v === "test/dummy/public/assets/images/flexberry-logo.png"; });
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
        var projectTypeNameCamel = "App";
        var projectTypeNameCebab = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            options.dummy = true;
            projectTypeNameCamel = "Addon";
            projectTypeNameCebab = "addon";
        }
        var coreBlueprint = new CoreBlueprint(this, options);
        return lodash.defaults({
            children: coreBlueprint.children,
            routes: coreBlueprint.routes,
            importProperties: coreBlueprint.importProperties,
            formsImportedProperties: coreBlueprint.formsImportedProperties,
            modelsImportedProperties: coreBlueprint.modelsImportedProperties,
            applicationCaption: coreBlueprint.sitemap.applicationCaption,
            applicationTitle: coreBlueprint.sitemap.applicationTitle,
            inflectorIrregular: coreBlueprint.inflectorIrregular,
            projectTypeNameCamel: projectTypeNameCamel,
            projectTypeNameCebab: projectTypeNameCebab // for use in files\ember-cli-build.js
        }, coreBlueprint.lodashVariablesApplicationMenu // for use in files\__root__\locales\**\translations.js
        );
    },
    _excludeIfExists: function () {
        var fileMap = this.getFileMap();
        var checkIfExists = lodash.intersection(this._files, this._generateOnce);
        var _loop_1 = function (file) {
            var targetFile = this_1.getTargetFile(file, fileMap);
            if (fs.existsSync(targetFile)) {
                lodash.remove(this_1._files, function (v) { return v === file; });
            }
        };
        var this_1 = this;
        for (var _i = 0, checkIfExists_1 = checkIfExists; _i < checkIfExists_1.length; _i++) {
            var file = checkIfExists_1[_i];
            _loop_1(file);
        }
    }
};
var CoreBlueprint = /** @class */ (function () {
    function CoreBlueprint(blueprint, options) {
        var listFormsDir = path.join(options.metadataDir, "list-forms");
        var listForms = fs.readdirSync(listFormsDir);
        var editFormsDir = path.join(options.metadataDir, "edit-forms");
        var editForms = fs.readdirSync(editFormsDir);
        var modelsDir = path.join(options.metadataDir, "models");
        var models = fs.readdirSync(modelsDir);
        var sitemapFile = path.join(options.metadataDir, "application", "sitemap.json");
        var children = [];
        var routes = [];
        var importProperties = [];
        var formsImportedProperties = [];
        var modelsImportedProperties = [];
        var irregularRules = [];
        var inflectorIrregular = [];
        for (var _i = 0, listForms_1 = listForms; _i < listForms_1.length; _i++) {
            var formFileName = listForms_1[_i];
            var pp = path.parse(formFileName);
            if (pp.ext != ".json")
                continue;
            var listFormFile = path.join(listFormsDir, formFileName);
            var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
            var listForm = JSON.parse(content);
            if (listForm.external)
                continue;
            var listFormName = pp.name;
            routes.push("  this.route('" + listFormName + "');");
            routes.push("  this.route('" + listForm.editForm + "',\n  { path: '" + listForm.editForm + "/:id' });");
            routes.push("  this.route('" + listForm.newForm + ".new',\n  { path: '" + listForm.newForm + "/new' });");
            importProperties.push("import " + listForm.name + "Form from './forms/" + listFormName + "';");
            formsImportedProperties.push("    '" + listFormName + "': " + listForm.name + "Form");
        }
        for (var _a = 0, editForms_1 = editForms; _a < editForms_1.length; _a++) {
            var formFileName = editForms_1[_a];
            var pp = path.parse(formFileName);
            if (pp.ext != ".json")
                continue;
            var editFormFile = path.join(editFormsDir, formFileName);
            var content = stripBom(fs.readFileSync(editFormFile, "utf8"));
            var editForm = JSON.parse(content);
            if (editForm.external)
                continue;
            var editFormName = pp.name;
            importProperties.push("import " + editForm.name + "Form from './forms/" + editFormName + "';");
            formsImportedProperties.push("    '" + editFormName + "': " + editForm.name + "Form");
        }
        for (var _b = 0, models_1 = models; _b < models_1.length; _b++) {
            var modelFileName = models_1[_b];
            var pp = path.parse(modelFileName);
            if (pp.ext != ".json")
                continue;
            var model = ModelBlueprint_1.default.loadModel(modelsDir, modelFileName);
            if (model.external)
                continue;
            var modelName = pp.name;
            var LAST_WORD_CAMELIZED_REGEX = /([\w/\s-]*)([А-ЯЁA-Z][а-яёa-z\d]*$)/;
            var irregularLastWordOfModelName = LAST_WORD_CAMELIZED_REGEX.exec(model.name)[2].toLowerCase();
            var irregularLastWordOfModelNames = irregularLastWordOfModelName.charAt(0).toUpperCase() + irregularLastWordOfModelName.slice(1) + 's';
            importProperties.push("import " + model.name + "Model from './models/" + modelName + "';");
            modelsImportedProperties.push("    '" + modelName + "': " + model.name + "Model");
            irregularRules.push({ name: irregularLastWordOfModelName, names: irregularLastWordOfModelNames });
        }
        inflectorIrregular = irregularRules.sort(function (a, b) {
            if (a.name.length > b.name.length) {
                return -1;
            }
            else if (a.name.length < b.name.length) {
                return 1;
            }
            else {
                return 0;
            }
        }).map(function (item) {
            return "inflector.irregular('" + item.name + "', '" + item.names + "');";
        }).filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });
        this.sitemap = JSON.parse(stripBom(fs.readFileSync(sitemapFile, "utf8")));
        var localePathTemplate = this.getLocalePathTemplate(options, blueprint.isDummy, "translations.js");
        var applicationMenuLocales = new Locales_1.ApplicationMenuLocales("ru", localePathTemplate);
        for (var _c = 0, _d = this.sitemap.items; _c < _d.length; _c++) {
            var item = _d[_c];
            var childItemExt = new SitemapItemExt(item);
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
        this.inflectorIrregular = inflectorIrregular.join("\n");
    }
    CoreBlueprint.prototype.getLocalePathTemplate = function (options, isDummy, localePathSuffix) {
        var targetRoot = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
        }
        return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
    };
    return CoreBlueprint;
}());
var SitemapItemExt = /** @class */ (function () {
    function SitemapItemExt(baseItem) {
        this.baseItem = baseItem;
    }
    SitemapItemExt.prototype.process = function (parentTranslationProp, level) {
        var translationProp;
        var translationName;
        if (this.baseItem.menuName) {
            translationName = this.baseItem.menuName;
        }
        else {
            translationName = this.baseItem.link;
        }
        translationProp = parentTranslationProp + "." + translationName;
        var childrenTranslation = [];
        var childrenTranslationOtherLocales = [];
        var sitemap = [];
        if (this.baseItem.children) {
            for (var _i = 0, _a = this.baseItem.children; _i < _a.length; _i++) {
                var childItem = _a[_i];
                var childItemExt = new SitemapItemExt(childItem);
                childItemExt.process(translationProp, level + 1);
                childrenTranslation.push(childItemExt.translation);
                childrenTranslationOtherLocales.push(childItemExt.translationOtherLocales);
                sitemap.push(childItemExt.sitemap);
            }
        }
        var indent = [];
        for (var i = 0; i < level; i++) {
            indent.push(TAB);
        }
        var indentStr = indent.join("");
        indent.pop();
        var indentStr2 = indent.join("");
        var childrenStr = "";
        var sitemapChildrenStr = "null";
        var childrenOtherLocalesStr = "";
        if (childrenTranslation.length > 0) {
            childrenStr = childrenTranslation.join(",\n");
            childrenOtherLocalesStr = childrenTranslationOtherLocales.join(",\n");
            sitemapChildrenStr = "[" + sitemap.join(", ") + "]";
        }
        this.translation = "" + indentStr2 + this.quote(translationName) + ": {\n" + indentStr + "caption: '" + this.escapeValue(this.baseItem.caption) + "',\n" +
            (indentStr + "title: '" + this.escapeValue(this.baseItem.title) + "',\n" + childrenStr + "\n" + indentStr2 + "}");
        this.translationOtherLocales = "" + indentStr2 + this.quote(translationName) + ": {\n" + indentStr + "caption: '" + this.escapeValue(translationName) + "',\n" +
            (indentStr + "title: '" + this.escapeValue(translationName) + "',\n" + childrenOtherLocalesStr + "\n" + indentStr2 + "}");
        var INDENT = "";
        this.sitemap = "{\n" + INDENT + indentStr + "link: " + this.quoteIfNotNull(this.baseItem.link) + ",\n" +
            ("" + INDENT + indentStr + "caption: i18n.t('" + translationProp + ".caption'),\n") +
            ("" + INDENT + indentStr + "title: i18n.t('" + translationProp + ".title'),\n") +
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
