/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
var stripBom = require("strip-bom");
var fs = require("fs");
var path = require('path');
module.exports = {
    description: 'Generates an ember application for flexberry.',
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
        return {
            children: applicationBlueprint.children,
            routes: applicationBlueprint.routes // for use in files\__root__\router.js
        };
    }
};
var ApplicationBlueprint = (function () {
    function ApplicationBlueprint(blueprint, options) {
        var listFormsDir = path.join(options.metadataDir, "list-forms");
        var listForms = fs.readdirSync(listFormsDir);
        var children = [];
        var routes = [];
        for (var _i = 0, listForms_1 = listForms; _i < listForms_1.length; _i++) {
            var form = listForms_1[_i];
            var listFormFile = path.join(listFormsDir, form);
            var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
            var listForm = JSON.parse(content);
            var listFormName = path.parse(form).name;
            children.push("      {\n        link: '" + listFormName + "',\n        title: '" + listForm.caption + "',\n        children: null\n      }");
            routes.push("  this.route('" + listFormName + "');");
            routes.push("  this.route('" + listForm.editForm + "', { path: '" + listForm.editForm + "/:id' });");
            routes.push("  this.route('" + listForm.newForm + ".new', { path: '" + listForm.newForm + "/new' });");
        }
        this.children = children.join(",\n");
        this.routes = routes.join("\n");
    }
    return ApplicationBlueprint;
}());
//# sourceMappingURL=index.js.map