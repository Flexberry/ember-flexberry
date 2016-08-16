/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
import metadata = require('MetadataClasses');

import fs = require("fs");
import path = require('path');
const Blueprint = require('ember-cli/lib/models/blueprint');
const Promise = require('ember-cli/lib/ext/promise');
import http = require('http');
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
        let dirPath = path.join('./', this.metadataDir);
        try {
          fs.statSync(dirPath);
        } catch (e) {
          if (e.code === "ENOENT")
            fs.mkdirSync(dirPath);
        }
        let filenameUrl = path.join(dirPath, '/odataFeedUrl.txt');
        fs.writeFileSync(filenameUrl, odataFeedUrl);

        // TODO: get OData metadata.
        let filenameMetadata = path.join(dirPath, '/odataMetadata.xml');

        http.get({
          host: odataFeedUrl,
          path: '/$metadata'
        }, function (response) {
          // Continuously update stream with data
          this.options.ui.writeLine(`Get response with OData metadata: ${response}.`);
          let body = '';
          response.on('data', function (d) {
            body += d;
          });
          response.on('end', function () {
            fs.writeFileSync(filenameMetadata, body);
            this.options.ui.writeLine(`Get end response: ${body}.`);
          });
        }).on('error', (e) => {
          this.options.ui.writeLine(`Got error: ${e.message}`);
        }).end();

      }.bind(this)).then(function () {
        this.options.ui.writeLine(`send request`);

        http.get('http://www.google.com/index.html', (res) => {
          this.options.ui.writeLine(`Got response: ${res.statusCode}`);
          // consume response body
          res.resume();
        }).on('error', (e) => {
          this.options.ui.writeLine(`Got error: ${e.message}`);
        });
      }.bind(this));
  }
}
