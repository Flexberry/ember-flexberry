"use strict";
var child_process = require('child_process');
var Blueprint = require('ember-cli/lib/models/blueprint');
var Promise = require('rsvp');
var lodash = require('lodash');
const skipConfirmationFunc = require('../utils/skip-confirmation');
module.exports = {
    description: 'Generates all entities for flexberry.',
    availableOptions: [
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean },
        { name: 'new-theme', type: Boolean }
    ],
    supportsAddon: function () {
        return false;
    },
    install: function (options) {
        var applicationBlueprint = new ApplicationBlueprint(this, options);
        return applicationBlueprint.promise;
    },
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
    },

    processFiles(intoDir, templateVariables) {
        let skipConfirmation = this.options.skipConfirmation;
        if (skipConfirmation) {
            return skipConfirmationFunc(this, intoDir, templateVariables);
        }

        return this._super(...arguments);
    },
};
var ElapsedTime = (function () {
    function ElapsedTime(caption, startTime) {
        this.caption = caption;
        this.elapsedTimeSec = (Date.now() - startTime) / 1000;
    }
    ElapsedTime.print = function () {
        var total = 0;
        console.log("Ellapsed time:");
        for (var _i = 0, _a = ElapsedTime.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            console.log(group.caption + ": " + ElapsedTime.format(group.elapsedTimeSec));
            total += group.elapsedTimeSec;
        }
        console.log("Total: " + ElapsedTime.format(total));
    };
    ElapsedTime.format = function (sec) {
        //var hours = Math.floor(sec / 3600);
        //var min = Math.floor((sec - hours * 3600) / 60);
        //var sec2 = sec - hours * 3600 - min * 60;
        //return `${ElapsedTime.formatter.format(min)}:${ElapsedTime.formatter.format(sec2)}`;
        return ElapsedTime.formatterFrac.format(sec) + " sec";
    };
    ElapsedTime.add = function (caption, startTime) {
        ElapsedTime.groups.push(new ElapsedTime(caption, startTime));
        return Date.now();
    };
    ElapsedTime.groups = [];
    ElapsedTime.formatter = new Intl.NumberFormat('ru-RU', { minimumIntegerDigits: 2, maximumFractionDigits: 0 });
    ElapsedTime.formatterFrac = new Intl.NumberFormat('ru-RU', { minimumIntegerDigits: 2, maximumFractionDigits: 1, minimumFractionDigits: 1 });
    return ElapsedTime;
}());
var ApplicationBlueprint = (function () {
    function ApplicationBlueprint(blueprint, options) {
        if (options.metadataDir === undefined) {
            options.metadataDir = "vendor/flexberry";
        }
        this.metadataDir = options.metadataDir;
        this.options = options;
        this.promise = Promise.resolve();
        this.promise = this.emberGenerateFlexberryGroup("flexberry-object-init");
        this.promise = this.emberGenerateFlexberryGroup("flexberry-object");
        this.promise = this.emberGenerateFlexberryGroup("transform");
        this.promise = this.emberGenerateFlexberryGroup("transform-test");
        this.promise = this.emberGenerateFlexberryGroup("flexberry-acceptance-test");
        this.promise = this.emberGenerateFlexberryGroup("flexberry-model");
        this.promise = this.emberGenerateFlexberryGroup("flexberry-model-init");
        this.promise = this.emberGenerateFlexberryGroup("flexberry-serializer-init");
        this.promise = this.emberGenerateFlexberryGroup("flexberry-enum");
        this.promise = this.emberGenerateFlexberryGroup("flexberry-list-form");
        this.promise = this.emberGenerateFlexberryGroup("flexberry-edit-form");
        this.promise = this.emberGenerate("flexberry-common", "app");
        this.promise = this.emberGenerate("flexberry-core", "app");
        if (options.newTheme) {
            this.promise = this.emberGenerate("flexberry-install-new-theme", "app");
        }

        this.promise = this.promise
            .then(function () {
            ElapsedTime.print();
        });
    }
    ApplicationBlueprint.prototype.getMainBlueprint = function (blueprintName) {
        return Blueprint.lookup(blueprintName, {
            ui: undefined,
            analytics: undefined,
            project: undefined,
            paths: this.options.project.blueprintLookupPaths()
        });
    };
    ApplicationBlueprint.prototype.emberGenerateFlexberryGroup = function (blueprintName) {
        return this.emberGenerate("flexberry-group", blueprintName);
    };
    ApplicationBlueprint.prototype.emberGenerate = function (blueprintName, entityName) {
        var mainBlueprint = this.getMainBlueprint(blueprintName);
        var options = lodash.merge({}, this.options, { entity: { name: entityName } });
        return this.promise
            .then(function () {
            return mainBlueprint["install"](options);
        }).then(function () {
            ApplicationBlueprint.start = ElapsedTime.add(blueprintName + " " + entityName, ApplicationBlueprint.start);
        });
    };
    ApplicationBlueprint.prototype.execCommand = function (cmd) {
        console.log(cmd);
        return child_process.execSync(cmd, { stdio: ["inherit", "inherit", "inherit"] });
    };
    ApplicationBlueprint.start = Date.now();
    return ApplicationBlueprint;
}());
//# sourceMappingURL=index.js.map
