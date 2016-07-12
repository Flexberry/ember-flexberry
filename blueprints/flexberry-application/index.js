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
var ElapsedTime = (function () {
    function ElapsedTime(caption, startTime) {
        this.caption = caption;
        this.elapsedTimeSec = (Date.now() - startTime) / 1000;
    }
    ElapsedTime.print = function () {
        var total = 0;
        console.log("Ellapsed time:");
        for (var _i = 0, _a = ElapsedTime.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            console.log(group.caption + ": " + ElapsedTime.format(group.elapsedTimeSec));
            total += group.elapsedTimeSec;
        }
        console.log("Total: " + ElapsedTime.format(total));
    };
    ElapsedTime.format = function (sec) {
        var hours = Math.floor(sec / 3600);
        var min = Math.floor((sec - hours * 3600) / 60);
        var sec2 = sec - hours * 3600 - min * 60;
        return ElapsedTime.formatter.format(hours) + ":" + ElapsedTime.formatter.format(min) + ":" + ElapsedTime.formatter.format(sec2);
    };
    ElapsedTime.add = function (caption, startTime) {
        ElapsedTime.groups.push(new ElapsedTime(caption, startTime));
        return Date.now();
    };
    ElapsedTime.groups = [];
    ElapsedTime.formatter = new Intl.NumberFormat('ru-RU', { minimumIntegerDigits: 2, maximumFractionDigits: 0 });
    return ElapsedTime;
}());
var ApplicationBlueprint = (function () {
    function ApplicationBlueprint(blueprint, options) {
        this.metadataDir = options.metadataDir;
        var start, end;
        start = Date.now();
        this.emberGenerateTests("list-forms");
        this.emberGenerateTests("edit-forms");
        start = ElapsedTime.add("Tests for list-forms and edit-forms", start);
        this.emberGenerateFlexberryModel();
        start = ElapsedTime.add("Models", start);
        this.emberGenerate("flexberry-enum", "enums");
        start = ElapsedTime.add("Enums", start);
        this.execCommand("ember generate route index");
        this.emberGenerate("flexberry-list-form", "list-forms");
        start = ElapsedTime.add("List forms", start);
        this.emberGenerate("flexberry-edit-form", "edit-forms");
        start = ElapsedTime.add("Edit forms", start);
        this.execCommand("ember generate flexberry-core app --metadata-dir=" + this.metadataDir);
        start = ElapsedTime.add("flexberry-core", start);
        ElapsedTime.print();
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
            if (!this.fileExists("tests/unit/controllers/" + name_1 + "-test.js"))
                this.execCommand("ember generate controller-test " + name_1);
            if (!this.fileExists("tests/unit/routes/" + name_1 + "-test.js"))
                this.execCommand("ember generate route-test " + name_1);
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
    ApplicationBlueprint.prototype.emberGenerateFlexberryModel = function () {
        var blueprintName = "flexberry-model", metadataSubDir = "models";
        metadataSubDir = path.join(this.metadataDir, metadataSubDir);
        var list = fs.readdirSync(metadataSubDir);
        for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
            var file = list_3[_i];
            var name_3 = path.parse(file).name;
            if (!this.fileExists("app/models/" + name_3 + ".js"))
                this.execCommand("ember generate " + blueprintName + "-init " + name_3 + " --metadata-dir=" + this.metadataDir);
            this.execCommand("ember generate " + blueprintName + " " + name_3 + " --metadata-dir=" + this.metadataDir);
        }
    };
    ApplicationBlueprint.prototype.fileExists = function (path) {
        try {
            fs.statSync(path);
        }
        catch (e) {
            if (e.code === "ENOENT")
                return false;
        }
        return true;
    };
    return ApplicationBlueprint;
}());
//# sourceMappingURL=index.js.map