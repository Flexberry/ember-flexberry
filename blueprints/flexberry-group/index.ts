/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
import metadata = require('MetadataClasses');

import lodash = require('lodash');
import fs = require("fs");
import path = require('path');
const stripBom = require("strip-bom");
const Promise = require('ember-cli/lib/ext/promise');

const Blueprint = require('ember-cli/lib/models/blueprint');

module.exports = {

  description: 'Generates an group of entities for flexberry.',

  availableOptions: [
    { name: 'metadata-dir', type: String }
  ],

  install: function (options) {
    let groupBlueprint = new GroupBlueprint(this, options);
    return groupBlueprint.promise;
  }

};

class GroupBlueprint {
  static mainBlueprint;
  static groupOptions=[];
  public promise;
  private metadataDir: string;
  private options;
  private blueprint;
  blueprintName;

  static funCallback(arg) {
    let opt = GroupBlueprint.groupOptions.pop();
    return GroupBlueprint.mainBlueprint["install"](opt);
  }

  constructor(blueprint, options) {
    let projectTypeName = "app";
    if( options.project.pkg.keywords && options.project.pkg.keywords["0"] === "ember-addon" ) {
      projectTypeName = "addon";
    }
    this.metadataDir = options.metadataDir;
    this.options = options;
    this.blueprint = blueprint;
    this.blueprintName = options.entity.name;
    this.promise = Promise.resolve();
    this.setMainBlueprint(this.blueprintName);
    switch (this.blueprintName) {
      case 'controller-test':
        this.emberGenerate("list-forms");
        this.emberGenerate("edit-forms");
        break;
      case 'route-test':
        this.emberGenerate("list-forms");
        this.emberGenerate("edit-forms");
        break;
      case 'flexberry-enum':
        this.emberGenerate("enums");
        break;
      case 'flexberry-list-form':
        this.emberGenerate("list-forms");
        break;
      case 'flexberry-edit-form':
        this.emberGenerate("edit-forms");
        break;
      case 'flexberry-model':
        this.emberGenerate("models");
        break;
      case 'flexberry-model-init':
        this.emberGenerate("models", true, projectTypeName + "/models");
        break;
      case 'flexberry-serializer-init':
        this.emberGenerate("models", true, projectTypeName + "/serializers");
        break;
      default:
        throw new Error(`Unknown blueprint: ${this.blueprintName}`);

    }
  }

  setMainBlueprint(blueprintName) {
    GroupBlueprint.mainBlueprint = Blueprint.lookup(blueprintName, {
      ui: undefined,
      analytics: undefined,
      project: undefined,
      paths: ["node_modules/ember-flexberry/blueprints"]
    });
  }

  emberGenerate(metadataSubDir: string, notOverwrite = false, folderJsFiles=undefined) {
    metadataSubDir = path.join(this.metadataDir, metadataSubDir);
    let list = fs.readdirSync(metadataSubDir);
    for (let file of list) {
      let entityName = path.parse(file).name;
      if (notOverwrite && this.fileExists(`${folderJsFiles}/${entityName}.js`))
        continue;
      let groupOptions = lodash.merge({}, this.options, { entity: { name: entityName } });
      GroupBlueprint.groupOptions.push(groupOptions);
      this.promise = this.promise.then(GroupBlueprint.funCallback).then(function() {
        if( !( this.options.project.pkg.keywords && this.options.project.pkg.keywords["0"] === "ember-addon" )) {
          return;
        }

        let middlePaths;
        switch (this.blueprintName) {
          case 'flexberry-enum':
            middlePaths = ["enum", "transform"];
            break;
          case 'flexberry-list-form':
            middlePaths = ["controller", "route"];
            break;
          case 'flexberry-edit-form':
            middlePaths = ["controller", "route"];
            break;
          case 'flexberry-model':
            middlePaths = ["model", "serializer"];
            break;
          default:
            return;
        }

        let promises = [];
        for (let middlePath of middlePaths) {
          let flexberryAddon = Blueprint.lookup("flexberry-addon", {
            ui: undefined,
            analytics: undefined,
            project: undefined,
            paths: ["node_modules/ember-flexberry/blueprints"]
          });

          let addonBlueprintOptions = lodash.merge({}, groupOptions, { installingAddon: true, middlePath: middlePath, originBlueprintName: middlePath });

          promises.push( flexberryAddon["install"](addonBlueprintOptions));
        }
        return Promise.all(promises);
      }.bind(this));
    }
  }

  fileExists(path: string): boolean {
    try {
      fs.statSync(path);
    } catch (e) {
      if (e.code === "ENOENT")
        return false;
    }
    return true
  }

}

