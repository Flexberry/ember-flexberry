/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

const stripBom = require("strip-bom");
const skipConfirmationFunc = require('../utils/skip-confirmation');
import fs = require("fs");
import path = require('path');
import lodash = require('lodash');
import metadata = require('MetadataClasses');
import CommonUtils from '../flexberry-common/CommonUtils';

module.exports = {

  description: 'Generates an ember object for flexberry.',

  availableOptions: [
    { name: 'file', type: String },
    { name: 'metadata-dir', type: String },
    { name: 'skip-confirmation', type: Boolean }
  ],

  supportsAddon: function () {
    return false;
  },

  afterInstall: function (options) {
    if (this.project.isEmberCLIAddon()) {
      CommonUtils.installFlexberryAddon(options, ["object", "transform"]);
    }
  },

  processFiles(intoDir, templateVariables) {
    let skipConfirmation = this.options.skipConfirmation;
    if (skipConfirmation) {
      return skipConfirmationFunc(this, intoDir, templateVariables);
    }

    return this._super.processFiles.appy(this, [intoDir, templateVariables]);
  },

  /**
   * Blueprint Hook locals.
   * Use locals to add custom template variables. The method receives one argument: options.
   *
   * @method locals
   * @public
   *
   * @param {Object} options Options is an object containing general and entity-specific options.
   * @return {Object} Custom template variables.
   */
  locals: function (options) {
    let objectsDir = path.join(options.metadataDir, "objects");
    if (!options.file) {
      options.file = options.entity.name + ".json";
    }
    let objectFile = path.join(objectsDir, options.file);
    let content: string = stripBom(fs.readFileSync(objectFile, "utf8"));
    let object: metadata.EmberObject = JSON.parse(content);
    let attr: metadata.DSattr;
    let attrs: string[] = [];
    for (attr of object.attrs) {
      if (attr.defaultValue === "") {
        attrs.push(`${attr.name}: undefined`);
      } else {
        if (attr.type === "string" || attr.type === "guid") {
          attrs.push(`${attr.name}: "${attr.defaultValue}"`);
        } else {
          if (attr.type === "date") {
            attrs.push(`${attr.name}: Date.parse("${attr.defaultValue}")`);
          } else {
            attrs.push(`${attr.name}: ${attr.defaultValue}`);
          }
        }
      }

    }
    return {
      attrs: "  " + attrs.join(",\n  "),// for use in files\__root__\mixins\regenerated\objects\__name__.js
    };
  }
};
