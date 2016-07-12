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

class ElapsedTime {
  public caption: string;
  public elapsedTimeSec: number;
  private static groups: ElapsedTime[] = [];
  private static formatter = new Intl.NumberFormat('ru-RU', { minimumIntegerDigits: 2, maximumFractionDigits: 0 });

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
    let hours = Math.floor(sec / 3600);
    let min = Math.floor((sec - hours * 3600) / 60);
    let sec2 = sec - hours * 3600 - min * 60;
    return `${ElapsedTime.formatter.format(hours)}:${ElapsedTime.formatter.format(min)}:${ElapsedTime.formatter.format(sec2)}`;
  }

  public static add(caption: string, startTime: number): number {
    ElapsedTime.groups.push(new ElapsedTime(caption, startTime));
    return Date.now();
  }
}

class ApplicationBlueprint {
  private metadataDir: string;
  constructor(blueprint, options) {
    this.metadataDir = options.metadataDir;
    let start: number, end: number;
    start = Date.now();
    this.emberGenerateTests("list-forms");
    this.emberGenerateTests("edit-forms");
    start = ElapsedTime.add("Tests for list-forms and edit-forms", start);
    this.emberGenerateFlexberryModel();
    start = ElapsedTime.add("Models", start);
    this.emberGenerate("flexberry-enum", "enums");
    start = ElapsedTime.add("Enums", start);
    this.execCommand("ember generate route index");
    this.emberGenerate("flexberry-list-form", "list-forms");
    start = ElapsedTime.add("List forms", start);
    this.emberGenerate("flexberry-edit-form", "edit-forms");
    start = ElapsedTime.add("Edit forms", start);
    this.execCommand(`ember generate flexberry-core app --metadata-dir=${this.metadataDir}`);
    start = ElapsedTime.add("flexberry-core", start);
    ElapsedTime.print();
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
      if (!this.fileExists(`tests/unit/controllers/${name}-test.js`))
        this.execCommand(`ember generate controller-test ${name}`);
      if (!this.fileExists(`tests/unit/routes/${name}-test.js`))
        this.execCommand(`ember generate route-test ${name}`);
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

  emberGenerateFlexberryModel() {
    let blueprintName: string = "flexberry-model", metadataSubDir: string = "models";
    metadataSubDir = path.join(this.metadataDir, metadataSubDir);
    let list = fs.readdirSync(metadataSubDir);
    for (let file of list) {
      let name = path.parse(file).name;
      if (!this.fileExists(`app/models/${name}.js`))
        this.execCommand(`ember generate ${blueprintName}-init ${name} --metadata-dir=${this.metadataDir}`);
      this.execCommand(`ember generate ${blueprintName} ${name} --metadata-dir=${this.metadataDir}`);
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
