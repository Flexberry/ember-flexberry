"use strict";
var lodash = require('lodash');
var fs = require("fs");
var path = require('path');
var stripBom = require("strip-bom");
var Blueprint = require('ember-cli/lib/models/blueprint');
var Promise = require('ember-cli/lib/ext/promise');
module.exports = {
    description: 'Generates an group of entities for flexberry.',
    availableOptions: [
        { name: 'metadata-dir', type: String }
    ],
    install: function (options) {
        var groupBlueprint = new GroupBlueprint(this, options);
        return groupBlueprint.promise;
    }
};
var GroupBlueprint = (function () {
    function GroupBlueprint(blueprint, options) {
        this.metadataDir = options.metadataDir;
        this.options = options;
        this.blueprint = blueprint;
        this.blueprintName = options.entity.name;
        this.promise = Promise.resolve();
        this.setMainBlueprint(this.blueprintName);
        switch (this.blueprintName) {
            case 'controller-test':
                this.emberGenerate("list-forms");
                this.emberGenerate("edit-forms");
                break;
            case 'route-test':
                this.emberGenerate("list-forms");
                this.emberGenerate("edit-forms");
                break;
            case 'flexberry-enum':
                this.emberGenerate("enums");
                break;
            case 'flexberry-list-form':
                this.emberGenerate("list-forms");
                break;
            case 'flexberry-edit-form':
                this.emberGenerate("edit-forms");
                break;
            case 'flexberry-edit-form':
                this.emberGenerate("edit-forms");
                break;
            case 'flexberry-model':
                this.emberGenerate("models");
                break;
            case 'flexberry-model-init':
                this.emberGenerate("models", true, "app/models");
                break;
            case 'flexberry-serializer-init':
                this.emberGenerate("models", true, "app/serializers");
                break;
            default:
                throw new Error("Unknown blueprint: " + this.blueprintName);
        }
    }
    GroupBlueprint.funCallback = function (arg) {
        var opt = GroupBlueprint.groupOptions.pop();
        return GroupBlueprint.mainBlueprint["install"](opt);
    };
    GroupBlueprint.prototype.setMainBlueprint = function (blueprintName) {
        GroupBlueprint.mainBlueprint = Blueprint.lookup(blueprintName, {
            ui: undefined,
            analytics: undefined,
            project: undefined,
            paths: ["node_modules/ember-flexberry/blueprints"]
        });
    };
    GroupBlueprint.prototype.emberGenerate = function (metadataSubDir, notOverwrite, folderJsFiles) {
        if (notOverwrite === void 0) { notOverwrite = false; }
        if (folderJsFiles === void 0) { folderJsFiles = undefined; }
        metadataSubDir = path.join(this.metadataDir, metadataSubDir);
        var list = fs.readdirSync(metadataSubDir);
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var file = list_1[_i];
            var entityName = path.parse(file).name;
            if (notOverwrite && this.fileExists(folderJsFiles + "/" + entityName + ".js"))
                continue;
            var groupOptions = lodash.merge({}, this.options, { entity: { name: entityName } });
            GroupBlueprint.groupOptions.push(groupOptions);
            this.promise = this.promise.then(GroupBlueprint.funCallback);
        }
    };
    GroupBlueprint.prototype.fileExists = function (path) {
        try {
            fs.statSync(path);
        }
        catch (e) {
            if (e.code === "ENOENT")
                return false;
        }
        return true;
    };
    GroupBlueprint.groupOptions = [];
    return GroupBlueprint;
}());
//# sourceMappingURL=index.js.map