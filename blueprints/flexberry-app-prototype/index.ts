/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
import metadata = require('MetadataClasses');

import fs = require("fs");
import path = require('path');
const Blueprint = require('ember-cli/lib/models/blueprint');
const Promise = require('ember-cli/lib/ext/promise');
import lodash = require('lodash');

module.exports = {
  description: 'Prototyping flexberry applications by external metadata.',

  availableOptions: [
    { name: 'metadata-dir', type: String },
    { name: 'odata-feed-url', type: String }
  ],

  install: function (options) {
    if (options.metadataDir === undefined) {
      options.metadataDir = "vendor\\flexberry";
    }

    let prototypeBlueprint = new PrototypeBlueprint(this, options);
    return prototypeBlueprint.promise;
  }
};

class PrototypeBlueprint {
  public promise;
  private metadataDir: string;
  private odataFeedUrl: string;
  private options;

  constructor(blueprint, options) {
    this.metadataDir = options.metadataDir;
    this.odataFeedUrl = options.odataFeedUrl;
    this.options = options;
    this.promise = Promise.resolve();
    this.promise = this.getOdataMetadata(this.metadataDir, this.odataFeedUrl);
    this.promise = this.promise;
  }

  getOdataMetadata(metadataDir: string, odataFeedUrl: string) {
    return this.promise
      .then(function () {
        this.options.ui.writeLine(`Get OData metadata from ${odataFeedUrl} and write it to ${metadataDir}`);
        // TODO: write to file odata-feed-url.
      }.bind(this));
  }
}
