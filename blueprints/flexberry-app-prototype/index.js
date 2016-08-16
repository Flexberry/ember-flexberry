"use strict";
var fs = require("fs");
var path = require('path');
var Blueprint = require('ember-cli/lib/models/blueprint');
var Promise = require('ember-cli/lib/ext/promise');
var http = require('http');
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
        this.promise = this.getOdataMetadata(this.metadataDir, this.odataFeedUrl);
        this.promise = this.promise;
    }
    PrototypeBlueprint.prototype.getOdataMetadata = function (metadataDir, odataFeedUrl) {
        return this.promise
            .then(function () {
            var _this = this;
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
            // TODO: get OData metadata.
            var filenameMetadata = path.join(dirPath, '/odataMetadata.xml');
            http.get({
                host: odataFeedUrl,
                path: '/$metadata'
            }, function (response) {
                // Continuously update stream with data
                this.options.ui.writeLine("Get response with OData metadata: " + response + ".");
                var body = '';
                response.on('data', function (d) {
                    body += d;
                });
                response.on('end', function () {
                    fs.writeFileSync(filenameMetadata, body);
                    this.options.ui.writeLine("Get end response: " + body + ".");
                });
            }).on('error', function (e) {
                _this.options.ui.writeLine("Got error: " + e.message);
            }).end();
        }.bind(this)).then(function () {
            var _this = this;
            this.options.ui.writeLine("send request");
            http.get('http://www.google.com/index.html', function (res) {
                _this.options.ui.writeLine("Got response: " + res.statusCode);
                // consume response body
                res.resume();
            }).on('error', function (e) {
                _this.options.ui.writeLine("Got error: " + e.message);
            });
        }.bind(this));
    };
    return PrototypeBlueprint;
}());
//# sourceMappingURL=index.js.map