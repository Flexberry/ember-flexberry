/*jshint node:true*/
var fs = require("fs");
var stripBom = require("strip-bom");
var path = require('path');
var template = require('lodash/template');
var find = require('lodash/find');
var indexOf = require('lodash/indexOf');
var sortBy = require('lodash/sortBy');
var map = require('lodash/map');
var concat = require('lodash/concat');

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

    locals: function (options) {
        if (!options.file) {
            options.file = options.entity.name + ".json";
        }

        var editFormBlueprint = new EditFormBlueprint(this, options);
        editFormBlueprint.process();

        return {
            modelName: editFormBlueprint.editForm.projections[0].modelName,// for use in files\__root__\routes\__name__.js, files\__root__\routes\__name__\new.js
            modelProjection: editFormBlueprint.editForm.projections[0].modelProjection,// for use in files\__root__\routes\__name__.js, files\__root__\routes\__name__\new.js
            formName: editFormBlueprint.editForm.name,// for use in files\__root__\controllers\__name__\new.js
            entityName: options.entity.name,// for use in files\__root__\controllers\__name__\new.js
            caption: editFormBlueprint.editForm.caption,// for use in files\__root__\controllers\__name__.js
            flexberryComponents: editFormBlueprint.snippetsResult.join("\n")// for use in files\__root__\templates\__name__.hbs
        };
    }
};

function EditFormBlueprint(blueprint, options) {
    this._tmpSnippetsResult = [];
    this.snippetsResult = [];
    this.editForm = {};
    this.modelsDir = path.join(options.metadataDir, "models");
    this.readSnippetFile = function (fileName, fileExt) {
        return stripBom(fs.readFileSync(path.join(blueprint.path, "snippets", fileName + "."+ fileExt), "utf8"));
    }
    this.readHbsSnippetFile = function(componentName) {
        return this.readSnippetFile(componentName,"hbs");
    }
    this.loadSnippet = function (model, attrName) {
        var modelAttr = find(model.attrs, function (attr) { return attr.name === attrName; });
        var component = find(componentMaps, function (map) { return indexOf(map.types, modelAttr.type) !== -1; });
        if (!component) {
            return this.readHbsSnippetFile("flexberry-dropdown");
        }
        return this.readHbsSnippetFile(component.name);
    };
    this.fillBelongsToAttrs = function (belongsToArray, parentPath) {
        for (var idx in belongsToArray) {
            var belongsTo = belongsToArray[idx];
            var currentPath = concat(parentPath, belongsTo.name);
            for (var idx2 in belongsTo.attrs) {
                var belongsToAttr = belongsTo.attrs[idx2];
                if (belongsToAttr.hidden || belongsToAttr.index === -1) {
                    continue;
                }
                var model = this.loadModel(belongsTo.relatedTo);
                var snippet = this.loadSnippet(model, belongsToAttr.name);
                belongsToAttr.name = concat(currentPath, belongsToAttr.name).join(".");
                this._tmpSnippetsResult.push({ index: belongsToAttr.index, snippetResult: template(snippet)(belongsToAttr) });
            }
            this.fillBelongsToAttrs(belongsTo.belongsTo, currentPath);
        }
    };
    this.process = function() {
        var idx, projAttr;
        var editFormsDir = path.join(options.metadataDir, "edit-forms");
        var editFormsFile = path.join(editFormsDir, options.file);
        var content = stripBom(fs.readFileSync(editFormsFile, "utf8"));
        this.editForm = JSON.parse(content);
        var linkProj = this.editForm.projections[0];
        var model = this.loadModel(linkProj.modelName);
        var proj = find(model.projections, function(pr) { return pr.name === linkProj.modelProjection; });
        for (idx in proj.attrs) {
            projAttr = proj.attrs[idx];
            if (projAttr.hidden || projAttr.index === -1) {
                continue;
            }
            var snippet = this.loadSnippet(model, projAttr.name);
            this._tmpSnippetsResult.push({ index: projAttr.index, snippetResult: template(snippet)(projAttr) });
        }
        this.fillBelongsToAttrs(proj.belongsTo, []);
        for (idx in proj.belongsTo) {
            var belongsTo = proj.belongsTo[idx];
            if (belongsTo.hidden || belongsTo.index === -1) {
                continue;
            }
            var propertyLookup = find(this.editForm.propertyLookup, function (propLookup) { return propLookup.relationName === belongsTo.relationName; });
            if (propertyLookup) {
                belongsTo.projection = propertyLookup.projection;
                this._tmpSnippetsResult.push({ index: belongsTo.index, snippetResult: template(this.readHbsSnippetFile("flexberry-lookup"))(belongsTo) });
            }
        }
        this._tmpSnippetsResult = sortBy(this._tmpSnippetsResult, ["index"]);
        this.snippetsResult = map(this._tmpSnippetsResult, "snippetResult");
        for (idx in proj.hasMany) {
            var hasMany = proj.hasMany[idx];
            this.snippetsResult.push(template(this.readHbsSnippetFile("flexberry-groupedit"))(hasMany));
        }

    };
    this.loadModel = function(modelName) {
        var modelFile = path.join(this.modelsDir, modelName + ".json");
        var content = stripBom(fs.readFileSync(modelFile, "utf8"));
        var model = JSON.parse(content);
        return model;
    };
}
