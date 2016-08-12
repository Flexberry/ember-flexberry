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
module.exports = {
    description: 'Generates core entities for flexberry.',
    availableOptions: [
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
     * @return {Object} Сustom template variables.
     */
    locals: function (options) {
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
        }, coreBlueprint.lodashVariablesApplicationMenu // for use in files\__root__\locales\**\translations.js
        );
    }
};
var CoreBlueprint = (function () {
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
        var inflectorIrregular = [];
        for (var _i = 0, listForms_1 = listForms; _i < listForms_1.length; _i++) {
            var formFileName = listForms_1[_i];
            var listFormFile = path.join(listFormsDir, formFileName);
            var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
            var listForm = JSON.parse(content);
            var listFormName = path.parse(formFileName).name;
            routes.push("  this.route('" + listFormName + "');");
            routes.push("  this.route('" + listForm.editForm + "', { path: '" + listForm.editForm + "/:id' });");
            routes.push("  this.route('" + listForm.newForm + ".new', { path: '" + listForm.newForm + "/new' });");
            importProperties.push("import " + listForm.name + "Form from './forms/" + listFormName + "';");
            formsImportedProperties.push("    '" + listFormName + "': " + listForm.name + "Form");
        }
        for (var _a = 0, editForms_1 = editForms; _a < editForms_1.length; _a++) {
            var formFileName = editForms_1[_a];
            var editFormFile = path.join(editFormsDir, formFileName);
            var content = stripBom(fs.readFileSync(editFormFile, "utf8"));
            var editForm = JSON.parse(content);
            var editFormName = path.parse(formFileName).name;
            importProperties.push("import " + editForm.name + "Form from './forms/" + editFormName + "';");
            formsImportedProperties.push("    '" + editFormName + "': " + editForm.name + "Form");
        }
        for (var _b = 0, models_1 = models; _b < models_1.length; _b++) {
            var modelFileName = models_1[_b];
            var modelFile = path.join(modelsDir, modelFileName);
            var content = stripBom(fs.readFileSync(modelFile, "utf8"));
            var model = JSON.parse(content);
            var modelName = path.parse(modelFileName).name;
            var LAST_WORD_CAMELIZED_REGEX = /([\w/\s-]*)([A-Z][a-z\d]*$)/;
            var irregularLastWordOfModelName = LAST_WORD_CAMELIZED_REGEX.exec(model.name)[2].toLowerCase();
            importProperties.push("import " + model.name + "Model from './models/" + modelName + "';");
            modelsImportedProperties.push("    '" + modelName + "': " + model.name + "Model");
            inflectorIrregular.push("inflector.irregular('" + irregularLastWordOfModelName + "', '" + irregularLastWordOfModelName + "s');");
        }
        this.sitemap = JSON.parse(stripBom(fs.readFileSync(sitemapFile, "utf8")));
        var applicationMenuLocales = new Locales_1.ApplicationMenuLocales("ru");
        for (var _c = 0, _d = this.sitemap.items; _c < _d.length; _c++) {
            var item = _d[_c];
            var childItemExt = new SitemapItemExt(item);
            childItemExt.process("forms.application.sitemap", 5);
            applicationMenuLocales.push(childItemExt.translation, childItemExt.translationOtherLocales);
            children.push(childItemExt.sitemap);
        }
        this.lodashVariablesApplicationMenu = applicationMenuLocales.getLodashVariablesWithSuffix("ApplicationMenu");
        this.children = children.join(", ");
        this.routes = routes.join("\n");
        this.importProperties = importProperties.join("\n");
        this.formsImportedProperties = formsImportedProperties.join(",\n");
        this.modelsImportedProperties = modelsImportedProperties.join(",\n");
        this.inflectorIrregular = inflectorIrregular.join("\n");
    }
    return CoreBlueprint;
}());
var SitemapItemExt = (function () {
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
        this.translation = ("" + indentStr2 + this.quote(translationName) + ": {\n" + indentStr + "caption: '" + this.escapeValue(this.baseItem.caption) + "',\n") +
            (indentStr + "title: '" + this.escapeValue(this.baseItem.title) + "',\n" + childrenStr + "\n" + indentStr2 + "}");
        this.translationOtherLocales = ("" + indentStr2 + this.quote(translationName) + ": {\n" + indentStr + "caption: '" + this.escapeValue(translationName) + "',\n") +
            (indentStr + "title: '" + this.escapeValue(translationName) + "',\n" + childrenOtherLocalesStr + "\n" + indentStr2 + "}");
        var INDENT = "";
        this.sitemap = ("{\n" + INDENT + indentStr + "link: " + this.quoteIfNotNull(this.baseItem.link) + ",\n") +
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