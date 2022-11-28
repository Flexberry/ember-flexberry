"use strict";
let lodash = require('lodash');
let fs = require("fs");
let path = require('path');
let stripBom = require("strip-bom");
let Promise = require('rsvp');
let Blueprint = require('ember-cli/lib/models/blueprint');
module.exports = {
    description: 'Generates an group of entities for flexberry.',
    availableOptions: [
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean }
    ],
    supportsAddon: function () {
        return false;
    },
    install: function (options) {
        let groupBlueprint = new GroupBlueprint(this, options);
        return groupBlueprint.promise;
    }
};
let GroupBlueprint = (function () {
    function GroupBlueprint(blueprint, options) {
        let projectTypeName = "app";
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
            case 'transform':
                this.emberGenerate("objects");
                break;
            case 'transform-test':
                this.emberGenerate("objects");
                break;
            case 'flexberry-acceptance-test':
                this.emberGenerate("list-forms");
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
            case 'flexberry-object':
                this.emberGenerate("objects");
                break;
            case 'flexberry-object-init':
                this.emberGenerate("objects", true, projectTypeName + "/objects");
                break;
            case 'flexberry-serializer-init':
                this.emberGenerate("models", true, projectTypeName + "/serializers");
                break;
            case 'flexberry-model-offline':
                this.emberGenerate("models");
                break;
            default:
                throw new Error("Unknown blueprint: " + this.blueprintName);
        }
    }
    GroupBlueprint.funCallback = function (arg) {
        let opt = GroupBlueprint.groupOptions.pop();
        return GroupBlueprint.mainBlueprint["install"](opt);
    };
    GroupBlueprint.prototype.setMainBlueprint = function (blueprintName) {
        GroupBlueprint.mainBlueprint = Blueprint.lookup(blueprintName, {
            ui: undefined,
            analytics: undefined,
            project: undefined,
            paths: this.options.project.blueprintLookupPaths()
        });
    };
    GroupBlueprint.prototype.emberGenerate = function (metadataSubDir, notOverwrite, folderJsFiles) {
        if (notOverwrite === void 0) { notOverwrite = false; }
        if (folderJsFiles === void 0) { folderJsFiles = undefined; }
        metadataSubDir = path.join(this.metadataDir, metadataSubDir);
        if (!fs.existsSync(metadataSubDir))
            return;
        let list = fs.readdirSync(metadataSubDir);
        for (let _i = 0, list_1 = list; _i < list_1.length; _i++) {
            let file = list_1[_i];
            let pp = path.parse(file);
            if (pp.ext != ".json")
                continue;
            let entityName = pp.name;

            if (notOverwrite && fs.existsSync(folderJsFiles + "/" + entityName + ".js"))
                continue;

            let entity = JSON.parse(stripBom(fs.readFileSync(path.join(metadataSubDir, file), "utf8")));
            if (entity.external)
                continue;

            let groupOptions = lodash.merge({}, this.options, { entity: { name: entityName } });
            GroupBlueprint.groupOptions.push(groupOptions);
            this.promise = this.promise.then(GroupBlueprint.funCallback);
        }
    };
    GroupBlueprint.groupOptions = [];
    return GroupBlueprint;
}());
//# sourceMappingURL=index.js.map
