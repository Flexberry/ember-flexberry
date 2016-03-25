/*jshint node:true*/
var fs = require("fs");
var stripBom = require("strip-bom");
var path = require('path');
var template = require('lodash/template');

module.exports = {
    description: 'Generates an ember application for flexberry.',

    availableOptions: [
        { name: 'metadata-dir', type: String }
    ],

    locals: function (options) {
        var templateNodeChild = template("          {\n            link: '<%=listForm%>',\n            title: '<%=caption%>',\n            children: null\n          }");
        var templateRouteList = template("this.route('<%=listForm%>');");
        var templateRouteEdit = template("this.route('<%=editForm%>', { path: '<%=editForm%>/:id' });");
        var templateRouteNew = template("this.route('<%=newForm%>.new', { path: '<%=newForm%>/new' });");
        var listFormsDir = path.join(options.metadataDir, "list-forms");
        var listForms = fs.readdirSync(listFormsDir);
        var idx;
        var children = [];
        var routes = [];
        for (idx in listForms) {
            var listFormFile = path.join(listFormsDir, listForms[idx]);
            var content = stripBom(fs.readFileSync(listFormFile, "utf8"));
            var listForm = JSON.parse(content);
            listForm.listForm = path.parse(listForms[idx]).name;
            children.push(templateNodeChild(listForm));
            routes.push(templateRouteList(listForm));
            routes.push(templateRouteEdit(listForm));
            routes.push(templateRouteNew(listForm));
        }
        return {
            children: children.join(",\n"),// for use in files\__root__\controllers\application.js
            routes: routes.join("\n")// for use in files\__root__\router.js
        };
    }
};

