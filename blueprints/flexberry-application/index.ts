/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
import metadata = require('MetadataClasses');

import fs = require("fs");
import path = require('path');
import child_process = require('child_process');
const Blueprint = require('ember-cli/lib/models/blueprint');
const Promise = require('rsvp');
const skipConfirmationFunc = require('../utils/skip-confirmation');
import lodash = require('lodash');


module.exports = {

  description: 'Generates all entities for flexberry.',

  availableOptions: [
    { name: 'metadata-dir', type: String },
    { name: 'skip-confirmation', type: Boolean }
  ],

  supportsAddon: function () {
    return false;
  },

  install: function (options) {
    let applicationBlueprint = new ApplicationBlueprint(this, options);
    return applicationBlueprint.promise;
  },

  processFiles(intoDir, templateVariables) {
    let skipConfirmation = this.options.skipConfirmation;
    if (skipConfirmation) {
      return skipConfirmationFunc(this, intoDir, templateVariables);
    }

    return this._super(...arguments);
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
  locals: function(options) {
  }
};

class ElapsedTime {
  public caption: string;
  public elapsedTimeSec: number;
  private static groups: ElapsedTime[] = [];
  private static formatter = new Intl.NumberFormat('ru-RU', { minimumIntegerDigits: 2, maximumFractionDigits: 0 });
  private static formatterFrac = new Intl.NumberFormat('ru-RU', { minimumIntegerDigits: 2, maximumFractionDigits: 1, minimumFractionDigits: 1 });

  public constructor(caption: string, startTime: number) {
    this.caption = caption;
    this.elapsedTimeSec = (Date.now() - startTime) / 1000;
  }

  public static print() {
    let total: number = 0;
    console.log("Ellapsed time:");
    for (let group of ElapsedTime.groups) {
      console.log(`${group.caption}: ${ElapsedTime.format(group.elapsedTimeSec)}`);
      total += group.elapsedTimeSec;
    }
    console.log(`Total: ${ElapsedTime.format(total)}`);
  }

  public static format(sec: number): string {
    //let hours = Math.floor(sec / 3600);
    //let min = Math.floor((sec - hours * 3600) / 60);
    //let sec2 = sec - hours * 3600 - min * 60;
    //return `${ElapsedTime.formatter.format(min)}:${ElapsedTime.formatter.format(sec2)}`;
    return `${ElapsedTime.formatterFrac.format(sec)} sec`;
  }

  public static add(caption: string, startTime: number): number {
    ElapsedTime.groups.push(new ElapsedTime(caption, startTime));
    return Date.now();
  }
}

class ApplicationBlueprint {
  public promise;
  private metadataDir: string;
  private options;
  static start = Date.now();

  constructor(blueprint, options) {
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
    this.promise = this.emberGenerateFlexberryGroup("flexberry-model");
    this.promise = this.emberGenerateFlexberryGroup("flexberry-model-init");
    this.promise = this.emberGenerateFlexberryGroup("flexberry-serializer-init");
    this.promise = this.emberGenerateFlexberryGroup("flexberry-enum");
    this.promise = this.emberGenerateFlexberryGroup("flexberry-list-form");
    this.promise = this.emberGenerateFlexberryGroup("flexberry-edit-form");
    if( !(options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon" )) {
      this.promise = this.emberGenerate("route", "index");
    }
    this.promise = this.emberGenerate("flexberry-common", "app");
    this.promise = this.emberGenerate("flexberry-core", "app");
    this.promise = this.promise
      .then(function () {
        ElapsedTime.print();
      });
  }

  getMainBlueprint(blueprintName) {
    return Blueprint.lookup(blueprintName, {
      ui: undefined,
      analytics: undefined,
      project: undefined,
      paths: this.options.project.blueprintLookupPaths()
    });
  }

  emberGenerateFlexberryGroup(blueprintName: string) {
    return this.emberGenerate("flexberry-group", blueprintName);
  }

  emberGenerate(blueprintName: string, entityName: string) {
    let mainBlueprint = this.getMainBlueprint(blueprintName);
    let options = lodash.merge({}, this.options, { entity: { name: entityName } });
    return this.promise
      .then(function () {
        return mainBlueprint["install"](options);
      }).then(function () {
        ApplicationBlueprint.start = ElapsedTime.add(`${blueprintName} ${entityName}`, ApplicationBlueprint.start);
      });
  }

  execCommand(cmd: string) {
    console.log(cmd);
    return child_process.execSync(cmd, { stdio: ["inherit", "inherit", "inherit"] });
  }
}
