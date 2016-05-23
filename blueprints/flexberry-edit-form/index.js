/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
const stripBom = require("strip-bom");
const fs = require("fs");
const path = require('path');
const lodash = require('lodash');
const componentMaps = [
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
class EditFormBlueprint {
    constructor(blueprint, options) {
        this.snippetsResult = [];
        this._tmpSnippetsResult = [];
        this.blueprint = blueprint;
        this.options = options;
        this.modelsDir = path.join(options.metadataDir, "models");
        this.process();
        this.flexberryComponents = this.snippetsResult.join("\n");
    }
    readSnippetFile(fileName, fileExt) {
        return stripBom(fs.readFileSync(path.join(this.blueprint.path, "snippets", fileName + "." + fileExt), "utf8"));
    }
    readHbsSnippetFile(componentName) {
        return this.readSnippetFile(componentName, "hbs");
    }
    loadModel(modelName) {
        let modelFile = path.join(this.modelsDir, modelName + ".json");
        let content = stripBom(fs.readFileSync(modelFile, "utf8"));
        let model = JSON.parse(content);
        return model;
    }
    findAttr(model, attrName) {
        return lodash.find(model.attrs, function (attr) { return attr.name === attrName; });
    }
    loadSnippet(model, attrName) {
        let modelAttr = this.findAttr(model, attrName);
        if (!modelAttr) {
            model = this.loadModel(model.parentModelName);
            return this.loadSnippet(model, attrName);
        }
        let component = lodash.find(componentMaps, function (map) { return lodash.indexOf(map.types, modelAttr.type) !== -1; });
        if (!component) {
            return this.readHbsSnippetFile("flexberry-dropdown");
        }
        return this.readHbsSnippetFile(component.name);
    }
    process() {
        let editFormsDir = path.join(this.options.metadataDir, "edit-forms");
        let editFormsFile = path.join(editFormsDir, this.options.file);
        let content = stripBom(fs.readFileSync(editFormsFile, "utf8"));
        this.editForm = JSON.parse(content);
        let linkProj = this.editForm.projections[0];
        let model = this.loadModel(linkProj.modelName);
        let proj = lodash.find(model.projections, function (pr) { return pr.name === linkProj.modelProjection; });
        let projAttr;
        for (projAttr of proj.attrs) {
            if (projAttr.hidden || projAttr.index === -1) {
                continue;
            }
            let snippet = this.loadSnippet(model, projAttr.name);
            let attr = this.findAttr(model, projAttr.name);
            projAttr.readonly = "readonly";
            projAttr.type = attr.type;
            this._tmpSnippetsResult.push({ index: projAttr.index, snippetResult: lodash.template(snippet)(projAttr) });
        }
        this.fillBelongsToAttrs(proj.belongsTo, []);
        let belongsTo, hasMany;
        for (belongsTo of proj.belongsTo) {
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
        for (hasMany of proj.hasMany) {
            hasMany.readonly = "readonly";
            this.snippetsResult.push(lodash.template(this.readHbsSnippetFile("flexberry-groupedit"))(hasMany));
        }
    }
    fillBelongsToAttrs(belongsToArray, parentPath) {
        for (let belongsTo of belongsToArray) {
            let currentPath = lodash.concat(parentPath, belongsTo.name);
            let belongsToAttr;
            for (belongsToAttr of belongsTo.attrs) {
                if (belongsToAttr.hidden || belongsToAttr.index === -1) {
                    continue;
                }
                let model = this.loadModel(belongsTo.relatedTo);
                let snippet = this.loadSnippet(model, belongsToAttr.name);
                let attr = this.findAttr(model, belongsToAttr.name);
                belongsToAttr.name = lodash.concat(currentPath, belongsToAttr.name).join(".");
                belongsToAttr.readonly = "true";
                belongsToAttr.type = attr.type;
                this._tmpSnippetsResult.push({ index: belongsToAttr.index, snippetResult: lodash.template(snippet)(belongsToAttr) });
            }
            this.fillBelongsToAttrs(belongsTo.belongsTo, currentPath);
        }
    }
}
//# sourceMappingURL=index.js.map