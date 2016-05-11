/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
var stripBom = require("strip-bom");
var fs = require("fs");
var path = require('path');
var lodash = require('lodash');
var template = lodash.template;
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
        for (var _i = 0; _i < listForms.length; _i++) {
            var form = listForms[_i];
            var listFormFile = path.join(listFormsDir, form);
            var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
            var listForm = JSON.parse(content);
            var listFormName = path.parse(form).name;
            children.push("  {\n  link: '" + listFormName + "',\n  title: '" + listForm.caption + "',\n  children: null\n  }");
            routes.push("this.route('" + listFormName + "');");
            routes.push("this.route('" + listForm.editForm + "', { path: '" + listForm.editForm + "/:id' });");
            routes.push("this.route('" + listForm.newForm + ".new', { path: '" + listForm.newForm + "/new' });");
        }
        this.children = children.join(",\n");
        this.routes = routes.join("\n");
    }
    return ApplicationBlueprint;
})();
//# sourceMappingURL=index.js.map