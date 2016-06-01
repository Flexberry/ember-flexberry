"use strict";
var fs = require("fs");
var path = require('path');
var child_process = require('child_process');
var stripBom = require("strip-bom");
module.exports = {
    description: 'Generates all entities for flexberry.',
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
        var applicationBlueprint = new ApplicationBlueprint(this, options);
    }
};
var ApplicationBlueprint = (function () {
    function ApplicationBlueprint(blueprint, options) {
        this.metadataDir = options.metadataDir;
        this.emberGenerateTests("list-forms");
        this.emberGenerateTests("edit-forms");
        this.execCommand("ember generate route index");
        this.emberGenerate("flexberry-model", "models");
        this.emberGenerate("flexberry-enum", "enums");
        this.emberGenerate("flexberry-list-form", "list-forms");
        this.emberGenerate("flexberry-edit-form", "edit-forms");
        this.execCommand("ember generate flexberry-core app --metadata-dir=" + this.metadataDir);
    }
    ApplicationBlueprint.prototype.execCommand = function (cmd) {
        console.log(cmd);
        return child_process.execSync(cmd, { stdio: ["inherit", "inherit", "inherit"] });
    };
    ApplicationBlueprint.prototype.emberGenerateTests = function (metadataSubDir) {
        metadataSubDir = path.join(this.metadataDir, metadataSubDir);
        var list = fs.readdirSync(metadataSubDir);
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var file = list_1[_i];
            var name_1 = path.parse(file).name;
            this.execCommand("ember generate route-test " + name_1);
            this.execCommand("ember generate controller-test " + name_1);
        }
    };
    ApplicationBlueprint.prototype.emberGenerate = function (blueprintName, metadataSubDir) {
        metadataSubDir = path.join(this.metadataDir, metadataSubDir);
        var list = fs.readdirSync(metadataSubDir);
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var file = list_2[_i];
            var name_2 = path.parse(file).name;
            this.execCommand("ember generate " + blueprintName + " " + name_2 + " --metadata-dir=" + this.metadataDir);
        }
    };
    return ApplicationBlueprint;
}());
//# sourceMappingURL=index.js.map