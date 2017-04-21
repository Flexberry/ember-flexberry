/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
"use strict";
var lodash = require('lodash');
var Blueprint = require('ember-cli/lib/models/blueprint');
var AddonBlueprint = (function () {
    function AddonBlueprint() {
    }
    AddonBlueprint.install = function (options, middlePaths) {
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
    return AddonBlueprint;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddonBlueprint;
//# sourceMappingURL=AddonBlueprint.js.map