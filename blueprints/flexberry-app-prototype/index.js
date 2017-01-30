"use strict";
var fs = require("fs");
var path = require("path");
var Blueprint = require('ember-cli/lib/models/blueprint');
var Promise = require('ember-cli/lib/ext/promise');
var http = require("http");
var https = require("https");
var xml2js = require("xml2js");
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
        var prototypeBlueprint = new PrototypeBlueprint(this, options);
        return prototypeBlueprint.promise;
    }
};
var PrototypeBlueprint = (function () {
    function PrototypeBlueprint(blueprint, options) {
        this.metadataDir = options.metadataDir;
        this.odataFeedUrl = options.odataFeedUrl;
        this.options = options;
        this.promise = Promise.resolve();
        //this.promise = this.getOdataMetadata(this.metadataDir, this.odataFeedUrl);
        this.promise = this.getContent(this.metadataDir, this.odataFeedUrl);
        // this.promise = this.parseXmlMetadata(this.metadataDir);
        this.promise = this.promise;
    }
    PrototypeBlueprint.prototype.getOdataMetadata = function (metadataDir, odataFeedUrl) {
        return this.promise
            .then(function () {
            this.options.ui.writeLine("Get OData metadata from " + odataFeedUrl + " and write it to " + metadataDir);
            var dirPath = path.join('./', this.metadataDir);
            try {
                fs.statSync(dirPath);
            }
            catch (e) {
                if (e.code === "ENOENT")
                    fs.mkdirSync(dirPath);
            }
            var filenameUrl = path.join(dirPath, '/odataFeedUrl.txt');
            fs.writeFileSync(filenameUrl, odataFeedUrl);
        }.bind(this));
    };
    ;
    PrototypeBlueprint.prototype.getContent = function (metadataDir, odataFeedUrl) {
        var url = odataFeedUrl + '/$metadata';
        var writeToFileName = path.join('./', metadataDir, '/odataMetadata.json');
        this.options.ui.writeLine("Get OData metadata from " + odataFeedUrl + " and write it to " + writeToFileName);
        return new Promise(function (resolve, reject) {
            var lib = url.lastIndexOf('https', 0) === 0 ? https : http;
            //      const request = lib.get(url, (response) => {
            var request = http.get(url, function (response) {
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error("Failed to load OData metadata from " + url + ", status code: " + response.statusCode));
                }
                var body = [];
                response.on('data', function (chunk) { return body.push(chunk); });
                response.on('end', function () {
                    // fs.writeFileSync(writeToFileName, body.join(''));
                    var xml = body.join('');
                    xml2js.parseString(xml, function (err, result) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            fs.writeFileSync(writeToFileName, JSON.stringify(result, null, ' '));
                            // TODO: parse xml metadata https://www.npmjs.com/package/xml2js
                            var schema = result["edmx:Edmx"]["edmx:DataServices"][0]["Schema"];
                            for (var i = 0; i < schema.length; i++) {
                                var namespace = schema[i]["$"]["Namespace"];
                                var entityTypes = schema[i]["EntityType"];
                                if (entityTypes) {
                                    for (var j = 0; j < entityTypes.length; j++) {
                                        var entityType = entityTypes[j];
                                        var modelName = entityType["$"]["Name"];
                                        var modelFilePath = path.join('./', metadataDir, 'models', '/' + modelName + '.json');
                                        fs.writeFileSync(modelFilePath, JSON.stringify(entityType, null, ' '));
                                    }
                                }
                                var enumTypes = schema[i]["EnumType"];
                                if (enumTypes) {
                                    for (var j = 0; j < enumTypes.length; j++) {
                                        var enumType = enumTypes[j];
                                        var enumName = enumType["$"]["Name"];
                                        var enumFilePath = path.join('./', metadataDir, 'enums', '/' + enumName + '.json');
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
            request.on('error', function (err) { return reject(err); });
        });
    };
    ;
    PrototypeBlueprint.prototype.parseXmlMetadata = function (metadataDir) {
        var readFromFileName = path.join('./', metadataDir, '/odataMetadata.xml');
        var writeToFileName = path.join('./', metadataDir, '/odataMetadata.json');
        return new Promise(function (resolve, reject) {
            var xml = fs.readFileSync(readFromFileName);
            xml2js.parseString(xml, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    fs.writeFileSync(writeToFileName, JSON.stringify(result, null, ' '));
                    // TODO: parse xml metadata https://www.npmjs.com/package/xml2js
                    resolve(true);
                }
            });
        });
    };
    ;
    return PrototypeBlueprint;
}());
//# sourceMappingURL=index.js.map