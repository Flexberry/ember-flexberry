/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
import metadata = require('MetadataClasses');

import fs = require("fs");
import path = require('path');
const Blueprint = require('ember-cli/lib/models/blueprint');
const Promise = require('ember-cli/lib/ext/promise');
import http = require('http');
import https = require('https');
import lodash = require('lodash');
import xml2js = require('xml2js');

module.exports = {
  description: 'Prototyping flexberry applications by external metadata.',

  availableOptions: [
    { name: 'metadata-dir', type: String },
    { name: 'odata-feed-url', type: String }
  ],

  install: function (options) {
    if (options.metadataDir === undefined) {
      options.metadataDir = "vendor/flexberry";
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
    //this.promise = this.getOdataMetadata(this.metadataDir, this.odataFeedUrl);
    this.promise = this.getContent(this.metadataDir, this.odataFeedUrl);
    // this.promise = this.parseXmlMetadata(this.metadataDir);
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
      }.bind(this));
  };

  getContent(metadataDir, odataFeedUrl) {
    let url = odataFeedUrl + '/$metadata';
    let writeToFileName = path.join('./', metadataDir, '/odataMetadata.json');

    this.options.ui.writeLine(`Get OData metadata from ${odataFeedUrl} and write it to ${writeToFileName}`);

    return new Promise((resolve, reject) => {
      const lib = url.lastIndexOf('https', 0) === 0 ? https : http;
//      const request = lib.get(url, (response) => {
      const request = http.get(url, (response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error(`Failed to load OData metadata from ${url}, status code: ` + response.statusCode));
        }
        const body = [];
        response.on('data', (chunk) => body.push(chunk));
        response.on('end', () => {

          // fs.writeFileSync(writeToFileName, body.join(''));

          let xml = body.join('');
          xml2js.parseString(xml, function (err, result) {
              if (err){
                reject(err);
              } else {
                fs.writeFileSync(writeToFileName, JSON.stringify(result, null, ' '));

                // TODO: parse xml metadata https://www.npmjs.com/package/xml2js
                let schema = result["edmx:Edmx"]["edmx:DataServices"][0]["Schema"];
                for (let i = 0; i < schema.length; i++) {
                  let namespace = schema[i]["$"]["Namespace"];
                  let entityTypes = schema[i]["EntityType"];

                  if (entityTypes) {
                    for (let j = 0; j < entityTypes.length; j++) {
                      let entityType = entityTypes[j];
                      let modelName = entityType["$"]["Name"];
                      let modelFilePath = path.join('./', metadataDir, 'models', '/'+ modelName +'.json');
                      fs.writeFileSync(modelFilePath, JSON.stringify(entityType, null, ' '));
                    }
                  }
                  let enumTypes = schema[i]["EnumType"];

                  if (enumTypes) {
                    for (let j = 0; j < enumTypes.length; j++) {
                      let enumType = enumTypes[j];
                      let enumName = enumType["$"]["Name"];
                      let enumFilePath = path.join('./', metadataDir, 'enums', '/'+ enumName +'.json');
                      fs.writeFileSync(enumFilePath, JSON.stringify(enumType, null, ' '));
                    }
                  }
                }

                resolve(true);
              }
          });

          // resolve(true)
        });
      });
      request.on('error', (err) => reject(err));
    });
  };

  parseXmlMetadata(metadataDir) {
     let readFromFileName = path.join('./', metadataDir, '/odataMetadata.xml');
     let writeToFileName = path.join('./', metadataDir, '/odataMetadata.json');
      return  new Promise((resolve, reject) => {
        let xml = fs.readFileSync(readFromFileName);
        xml2js.parseString(xml, function (err, result) {
            if (err){
              reject(err);
            } else {
              fs.writeFileSync(writeToFileName, JSON.stringify(result, null, ' '));

              // TODO: parse xml metadata https://www.npmjs.com/package/xml2js

              resolve(true);
            }
        });
    });
  };
}
