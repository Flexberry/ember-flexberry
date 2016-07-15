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
        }
    }
    GroupBlueprint.funCallback = function (arg) {
        var opt = GroupBlueprint.groupOptions.pop();
        return GroupBlueprint.mainBlueprint["install"](opt);
    };
    GroupBlueprint.prototype.setMainBlueprint = function (blueprintName) {
        GroupBlueprint.mainBlueprint = Blueprint.lookup(blueprintName, {
            ui: this.blueprint.ui,
            analytics: this.blueprint.analytics,
            project: this.blueprint.project
        });
    };
    GroupBlueprint.prototype.emberGenerate = function (metadataSubDir) {
        metadataSubDir = path.join(this.metadataDir, metadataSubDir);
        var list = fs.readdirSync(metadataSubDir);
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var file = list_1[_i];
            var entityName = path.parse(file).name;
            var groupOptions = lodash.merge({}, this.options, { entity: { name: entityName } });
            GroupBlueprint.groupOptions.push(groupOptions);
            this.promise = this.promise.then(GroupBlueprint.funCallback);
        }
    };
    GroupBlueprint.groupOptions = [];
    return GroupBlueprint;
}());
//# sourceMappingURL=index.js.map