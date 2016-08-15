"use strict";
var lodash = require('lodash');
var fs = require("fs");
var path = require('path');
var stripBom = require("strip-bom");
var Promise = require('ember-cli/lib/ext/promise');
var Blueprint = require('ember-cli/lib/models/blueprint');
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
        var projectTypeName = "app";
        if (options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon") {
            projectTypeName = "addon";
        }
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
            case 'flexberry-model':
                this.emberGenerate("models");
                break;
            case 'flexberry-model-init':
                this.emberGenerate("models", true, projectTypeName + "/models");
                break;
            case 'flexberry-serializer-init':
                this.emberGenerate("models", true, projectTypeName + "/serializers");
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
        var _loop_1 = function(file) {
            var entityName = path.parse(file).name;
            if (notOverwrite && this_1.fileExists(folderJsFiles + "/" + entityName + ".js"))
                return "continue";
            var groupOptions = lodash.merge({}, this_1.options, { entity: { name: entityName } });
            GroupBlueprint.groupOptions.push(groupOptions);
            this_1.promise = this_1.promise.then(GroupBlueprint.funCallback).then(function () {
                if (!(this.options.project.pkg.keywords && this.options.project.pkg.keywords["0"] === "ember-addon")) {
                    return;
                }
                var middlePaths;
                switch (this.blueprintName) {
                    case 'flexberry-enum':
                        middlePaths = ["enum", "transform"];
                        break;
                    case 'flexberry-list-form':
                        middlePaths = ["controller", "route"];
                        break;
                    case 'flexberry-edit-form':
                        middlePaths = ["controller", "route"];
                        break;
                    case 'flexberry-model':
                        middlePaths = ["model", "serializer"];
                        break;
                    default:
                        return;
                }
                var promises = [];
                for (var _i = 0, middlePaths_1 = middlePaths; _i < middlePaths_1.length; _i++) {
                    var middlePath = middlePaths_1[_i];
                    var flexberryAddon = Blueprint.lookup("flexberry-addon", {
                        ui: undefined,
                        analytics: undefined,
                        project: undefined,
                        paths: ["node_modules/ember-flexberry/blueprints"]
                    });
                    var addonBlueprintOptions = lodash.merge({}, groupOptions, { installingAddon: true, middlePath: middlePath, originBlueprintName: middlePath });
                    promises.push(flexberryAddon["install"](addonBlueprintOptions));
                }
                return Promise.all(promises);
            }.bind(this_1));
        };
        var this_1 = this;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var file = list_1[_i];
            var state_1 = _loop_1(file);
            if (state_1 === "continue") continue;
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