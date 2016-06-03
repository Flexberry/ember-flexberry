/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
import metadata = require('MetadataClasses');

import fs = require("fs");
import path = require('path');
import child_process = require('child_process');
const stripBom = require("strip-bom");

module.exports = {

  description: 'Generates all entities for flexberry.',

  availableOptions: [
    { name: 'metadata-dir', type: String }
  ],



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
    let applicationBlueprint = new ApplicationBlueprint(this, options);
  }
};

class ApplicationBlueprint {
  private metadataDir: string;
  constructor(blueprint, options) {
    this.metadataDir=options.metadataDir;
    this.emberGenerateTests("list-forms");
    this.emberGenerateTests("edit-forms");
    this.execCommand("ember generate route index");
    this.emberGenerate("flexberry-model", "models");
    this.emberGenerate("flexberry-enum", "enums");
    this.emberGenerate("flexberry-list-form", "list-forms");
    this.emberGenerate("flexberry-edit-form", "edit-forms");
    this.execCommand(`ember generate flexberry-core app --metadata-dir=${this.metadataDir}`);
  }

  execCommand(cmd: string){
    console.log(cmd);
    return child_process.execSync(cmd, {stdio:["inherit", "inherit", "inherit"]});
  }

  emberGenerateTests(metadataSubDir: string){
    metadataSubDir = path.join(this.metadataDir, metadataSubDir);
    let list = fs.readdirSync(metadataSubDir);
    for (let file of list) {
      let name = path.parse(file).name;
      this.execCommand(`ember generate route-test ${name}`);
      this.execCommand(`ember generate controller-test ${name}`);
    }
  }

  emberGenerate(blueprintName: string, metadataSubDir: string){
    metadataSubDir = path.join(this.metadataDir, metadataSubDir);
    let list = fs.readdirSync(metadataSubDir);
    for (let file of list) {
      let name = path.parse(file).name;
      this.execCommand(`ember generate ${blueprintName} ${name} --metadata-dir=${this.metadataDir}`);
    }
  }

}
