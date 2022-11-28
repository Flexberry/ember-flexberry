"use strict";
/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require("fs");
let path = require("path");
let lodash = require("lodash");
let stripBom = require("strip-bom");
let Locales_1 = require("../flexberry-core/Locales");
let CommonUtils_1 = require("../flexberry-common/CommonUtils");
const skipConfirmationFunc = require('../utils/skip-confirmation');
module.exports = {
    description: 'Generates an ember list-form for flexberry.',
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
            this._files = CommonUtils_1.default.getFilesForGeneration(this, function (v) { return v === "app/templates/__name__.hbs" || v === "app/templates/__name__/loading.hbs"; });
        }
        else {
            this._files = CommonUtils_1.default.getFilesForGeneration(this, function (v) { return v === "tests/dummy/app/templates/__name__.hbs" || v === "tests/dummy/app/templates/__name__/loading.hbs"; });
        }
        return this._files;
    },
    afterInstall: function (options) {
        if (this.project.isEmberCLIAddon()) {
            CommonUtils_1.default.installFlexberryAddon(options, ["controller", "route"]);
        }
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
        let listFormBlueprint = new ListFormBlueprint(this, options);
        return lodash.defaults({
            editForm: listFormBlueprint.listForm.editForm,
            formName: listFormBlueprint.listForm.name,
            entityName: options.entity.name,
            modelName: listFormBlueprint.listForm.projections[0].modelName,
            modelProjection: listFormBlueprint.listForm.projections[0].modelProjection,
            caption: listFormBlueprint.listForm.caption // for use in files\__root__\templates\__name__.hbs
        }, listFormBlueprint.locales.getLodashVariablesProperties() // for use in files\__root__\locales\**\forms\__name__.js
        );
    }
};
let ListFormBlueprint = /** @class */ (function () {
    function ListFormBlueprint(blueprint, options) {
        let listFormsDir = path.join(options.metadataDir, "list-forms");
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        let localePathTemplate = this.getLocalePathTemplate(options, blueprint.isDummy, path.join("forms", options.entity.name + ".js"));
        this.locales = new Locales_1.default(options.entity.name, "ru", localePathTemplate);
        let listFormFile = path.join(listFormsDir, options.file);
        let content = stripBom(fs.readFileSync(listFormFile, "utf8"));
        this.listForm = JSON.parse(content);
        this.locales.setupForm(this.listForm);
    }
    ListFormBlueprint.prototype.getLocalePathTemplate = function (options, isDummy, localePathSuffix) {
        let targetRoot = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            targetRoot = isDummy ? path.join("tests/dummy", targetRoot) : "addon";
        }
        return lodash.template(path.join(targetRoot, "locales", "${ locale }", localePathSuffix));
    };
    return ListFormBlueprint;
}());
//# sourceMappingURL=index.js.map