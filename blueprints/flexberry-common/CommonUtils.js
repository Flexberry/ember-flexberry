/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
"use strict";
var lodash = require("lodash");
var Blueprint = require('ember-cli/lib/models/blueprint');
var CommonUtils = (function () {
    function CommonUtils() {
    }
    CommonUtils.installFlexberryAddon = function (options, middlePaths) {
        var groupOptions = lodash.merge({}, options, { entity: { name: options.entity.name } });
        for (var _i = 0, middlePaths_1 = middlePaths; _i < middlePaths_1.length; _i++) {
            var middlePath = middlePaths_1[_i];
            var addonBlueprintOptions = lodash.merge({}, groupOptions, { installingAddon: true, middlePath: middlePath, originBlueprintName: middlePath });
            var flexberryAddon = Blueprint.lookup("flexberry-addon", {
                ui: undefined,
                analytics: undefined,
                project: undefined,
                paths: ["node_modules/ember-flexberry/blueprints"]
            });
            flexberryAddon["install"](addonBlueprintOptions);
        }
    };
    CommonUtils.installReexportNew = function (options, middlePaths) {
        var groupOptions = lodash.merge({}, options, { entity: { name: options.entity.name } });
        for (var _i = 0, middlePaths_2 = middlePaths; _i < middlePaths_2.length; _i++) {
            var middlePath = middlePaths_2[_i];
            var addonBlueprintOptions = lodash.merge({}, groupOptions, { installingAddon: true, middlePath: middlePath, originBlueprintName: middlePath });
            var flexberryAddon = Blueprint.lookup("flexberry-reexport-new", {
                ui: undefined,
                analytics: undefined,
                project: undefined,
                paths: ["node_modules/ember-flexberry/blueprints"]
            });
            flexberryAddon["install"](addonBlueprintOptions);
        }
    };
    CommonUtils.getFilesForGeneration = function (blueprint, exclusiveFunction) {
        if (exclusiveFunction === void 0) { exclusiveFunction = null; }
        let files = Blueprint.prototype.files.call(blueprint);
        if (exclusiveFunction != null) {
            lodash.remove(files, exclusiveFunction);
        }
        return files;
    };
    return CommonUtils;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommonUtils;
//# sourceMappingURL=CommonUtils.js.map