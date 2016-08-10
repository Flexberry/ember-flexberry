/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
import metadata = require('MetadataClasses');

import fs = require("fs");
import path = require('path');
const stripBom = require("strip-bom");

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
  locals: function(options) {
    let enumBlueprint = new EnumBlueprint(this, options);
    return {
      className: enumBlueprint.className, // for use in files\__root__\transforms\__name__.js
      name: enumBlueprint.name, // for use in files\__root__\transforms\__name__.js
      enumObjects: enumBlueprint.enumObjects // for use in files\__root__\enums\__name__.js
    };
  }
};

class EnumBlueprint {
  enumObjects: string;
  className: string;
  name: string;
  constructor(blueprint, options) {
    let enumsDir = path.join(options.metadataDir, "enums");
    if (!options.file) {
      options.file = options.entity.name + ".json";
    }
    let enumFile = path.join(enumsDir, options.file);
    let content = stripBom(fs.readFileSync(enumFile, "utf8"));
    let enumeration: metadata.Enumeration = JSON.parse(content);
    this.name = options.entity.name;
    this.className = enumeration.className;
    let values: string[] = [];
    for (let key in enumeration.enumObjects) {
      let caption = enumeration.enumObjects[key];
      if (caption === "~")
        caption = "";
      if (caption != null)
        caption = `'${caption}'`;
      else
        caption = `'${key}'`;
      values.push(`${key}: ${caption}`);
    }
    this.enumObjects = `{\n  ${values.join(",\n  ")}\n}`;
  }
}
