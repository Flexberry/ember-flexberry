/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
var stripBom = require("strip-bom");
var fs = require("fs");
var path = require('path');
var lodash = require('lodash');
var componentMaps = [
    { name: "flexberry-file", types: ["file"] },
    { name: "flexberry-checkbox", types: ["boolean"] },
    { name: "flexberry-datepicker", types: ["date"] },
    { name: "flexberry-field", types: ["string", "number"] }
];
module.exports = {
    description: 'Generates an ember edit-form for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
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
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }
        var editFormBlueprint = new EditFormBlueprint(this, options);
        return {
            modelName: editFormBlueprint.editForm.projections[0].modelName,
            modelProjection: editFormBlueprint.editForm.projections[0].modelProjection,
            formName: editFormBlueprint.editForm.name,
            entityName: options.entity.name,
            caption: editFormBlueprint.editForm.caption,
            flexberryComponents: editFormBlueprint.flexberryComponents // for use in files\__root__\templates\__name__.hbs
        };
    }
};
var EditFormBlueprint = (function () {
    function EditFormBlueprint(blueprint, options) {
        this.snippetsResult = [];
        this._tmpSnippetsResult = [];
        this.blueprint = blueprint;
        this.options = options;
        this.modelsDir = path.join(options.metadataDir, "models");
        this.process();
        this.flexberryComponents = this.snippetsResult.join("\n");
    }
    EditFormBlueprint.prototype.readSnippetFile = function (fileName, fileExt) {
        return stripBom(fs.readFileSync(path.join(this.blueprint.path, "snippets", fileName + "." + fileExt), "utf8"));
    };
    EditFormBlueprint.prototype.readHbsSnippetFile = function (componentName) {
        return this.readSnippetFile(componentName, "hbs");
    };
    EditFormBlueprint.prototype.loadModel = function (modelName) {
        var modelFile = path.join(this.modelsDir, modelName + ".json");
        var content = stripBom(fs.readFileSync(modelFile, "utf8"));
        var model = JSON.parse(content);
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
        var linkProj = this.editForm.projections[0];
        var model = this.loadModel(linkProj.modelName);
        var proj = lodash.find(model.projections, function (pr) { return pr.name === linkProj.modelProjection; });
        var projAttr;
        for (var _i = 0, _a = proj.attrs; _i < _a.length; _i++) {
            projAttr = _a[_i];
            if (projAttr.hidden || projAttr.index === -1) {
                continue;
            }
            var snippet = this.loadSnippet(model, projAttr.name);
            var attr = this.findAttr(model, projAttr.name);
            projAttr.readonly = "readonly";
            projAttr.type = attr.type;
            this._tmpSnippetsResult.push({ index: projAttr.index, snippetResult: lodash.template(snippet)(projAttr) });
        }
        this.fillBelongsToAttrs(proj.belongsTo, []);
        var belongsTo, hasMany;
        for (var _b = 0, _c = proj.belongsTo; _b < _c.length; _b++) {
            belongsTo = _c[_b];
            if (belongsTo.hidden || belongsTo.index === -1) {
                continue;
            }
            var propertyLookup = lodash.find(this.editForm.propertyLookup, function (propLookup) { return propLookup.relationName === belongsTo.relationName; });
            if (propertyLookup) {
                belongsTo.projection = propertyLookup.projection;
                belongsTo.readonly = "readonly";
                this._tmpSnippetsResult.push({ index: belongsTo.index, snippetResult: lodash.template(this.readHbsSnippetFile("flexberry-lookup"))(belongsTo) });
            }
        }
        this._tmpSnippetsResult = lodash.sortBy(this._tmpSnippetsResult, ["index"]);
        this.snippetsResult = lodash.map(this._tmpSnippetsResult, "snippetResult");
        for (var _d = 0, _e = proj.hasMany; _d < _e.length; _d++) {
            hasMany = _e[_d];
            hasMany.readonly = "readonly";
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
                this._tmpSnippetsResult.push({ index: belongsToAttr.index, snippetResult: lodash.template(snippet)(belongsToAttr) });
            }
            this.fillBelongsToAttrs(belongsTo.belongsTo, currentPath);
        }
    };
    return EditFormBlueprint;
}());
//# sourceMappingURL=index.js.map