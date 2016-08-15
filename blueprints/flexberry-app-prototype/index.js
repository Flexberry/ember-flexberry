"use strict";
var fs = require("fs");
var path = require('path');
var Blueprint = require('ember-cli/lib/models/blueprint');
var Promise = require('ember-cli/lib/ext/promise');
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
            this.options.ui.writeLine("Get OData metadata from " + odataFeedUrl + " and write it to " + metadataDir);
            var dirPath = path.join('./', this.metadataDir);
            try {
                fs.statSync(dirPath);
            }
            catch (e) {
                if (e.code === "ENOENT")
                    fs.mkdirSync(dirPath);
            }
            var filename = path.join(dirPath, '/odataFeedUrl.txt');
            fs.writeFileSync(filename, odataFeedUrl);
            // TODO: get OData metadata.
        }.bind(this));
    };
    return PrototypeBlueprint;
}());
//# sourceMappingURL=index.js.map