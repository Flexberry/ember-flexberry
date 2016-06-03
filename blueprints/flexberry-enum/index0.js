/*jshint node:true*/
var fs = require("fs");
var stripBom = require("strip-bom");
var path = require('path');

module.exports = {

  description: 'Generates an ember-data enum for flexberry.',

  availableOptions: [
    { name: 'file', type: String },
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
    var enumsDir = path.join(options.metadataDir, "enums");
    if (!options.file) {
      options.file = options.entity.name + ".json";
    }

    var enumFile = path.join(enumsDir, options.file);
    var content = stripBom(fs.readFileSync(enumFile, "utf8"));
    var enumeration = JSON.parse(content);

    return {
      values: "'" + enumeration.values.join("', '") + "'"// for use in files\__root__\transforms\__name__.js
    };
  }

};
