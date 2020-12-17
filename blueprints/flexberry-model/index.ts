/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

import ModelBlueprint from './ModelBlueprint';
import lodash = require('lodash');
import path = require('path');
import metadata = require('MetadataClasses');
import CommonUtils from '../flexberry-common/CommonUtils';
const skipConfirmationFunc = require('../utils/skip-confirmation');

module.exports = {

  description: 'Generates an ember-data model for flexberry.',

  availableOptions: [
    { name: 'file', type: String },
    { name: 'metadata-dir', type: String },
    { name: 'skip-confirmation', type: Boolean }
  ],

  supportsAddon: function () {
    return false;
  },

  _files: null,

  isDummy: false,

  files: function () {
    if (this._files) { return this._files; }
    this.isDummy = this.options.dummy;
    let modelsDir = path.join(this.options.metadataDir, "models");
    if (!this.options.file) {
      this.options.file = this.options.entity.name + ".json";
    }
    let model: metadata.Model = ModelBlueprint.loadModel(modelsDir, this.options.file);
    if (!model.offline) {
      this._files = CommonUtils.getFilesForGeneration(this, function(v) { return v === "__root__/mixins/regenerated/serializers/__name__-offline.js"; });
    } else {
      this._files = CommonUtils.getFilesForGeneration(this);
    }
    return this._files;
  },

  afterInstall: function (options) {
    if (this.project.isEmberCLIAddon()) {
      CommonUtils.installFlexberryAddon(options, ["model", "serializer"]);
    }
  },

  processFiles(intoDir, templateVariables) {
    let skipConfirmation = this.options.skipConfirmation;
    if (skipConfirmation) {
      return skipConfirmationFunc(this, intoDir, templateVariables);
    }

    return this._super.processFiles.apply(this, [intoDir, templateVariables]);
  },

  /**
   * Blueprint Hook locals.
   * Use locals to add custom template variables. The method receives one argument: options.
   *
   * @method locals
   * @public
   *
   * @param {Object} options Options is an object containing general and entity-specific options.
   * @return {Object} Custom template variables.
   */
  locals: function(options) {
    let modelBlueprint = new ModelBlueprint(this, options);
    return lodash.defaults({
      namespace: modelBlueprint.namespace,// for use in files\__root__\mixins\regenerated\models\__name__.js
      parentModelName: modelBlueprint.parentModelName,// for use in files\__root__\mixins\regenerated\models\__name__.js
      parentClassName: modelBlueprint.parentClassName,// for use in files\__root__\mixins\regenerated\models\__name__.js
      model: modelBlueprint.model,// for use in files\__root__\mixins\regenerated\models\__name__.js
      projections: modelBlueprint.projections,// for use in files\__root__\mixins\regenerated\models\__name__.js
      validations: modelBlueprint.validations,// for use in files\__root__\mixins\regenerated\models\__name__.js
      serializerAttrs: modelBlueprint.serializerAttrs,// for use in files\__root__\mixins\regenerated\serializers\__name__.js
      offlineSerializerAttrs: modelBlueprint.offlineSerializerAttrs,// for use in files\__root__\mixins\regenerated\serializers\__name__-offline.js
      name: modelBlueprint.name,// for use in files\tests\unit\models\__name__.js, files\tests\unit\serializers\__name__.js
      needsAllModels: modelBlueprint.needsAllModels,// for use in files\tests\unit\models\__name__.js, files\tests\unit\serializers\__name__.js
      needsAllEnums: modelBlueprint.needsAllEnums,// for use in files\tests\unit\serializers\__name__.js
      needsAllObjects: modelBlueprint.needsAllObjects,// for use in files\tests\unit\serializers\__name__.js
      enumImports: modelBlueprint.enumImports,// for use in files\__root__\mixins\regenerated\models\__name__.js
      },
      modelBlueprint.lodashVariables
    );
  },

  /**
   * Blueprint Hook filesPath.
   * Override the default files directory. Useful for switching between file sets conditionally.
   *
   * @method filesPath
   * @public
   *
   * @param {Object} options Options is an object containing general and entity-specific options.
   * @return {String} Overridden files directory.
   */
  filesPath: function (options) {
    const filesPathSuffix = ModelBlueprint.checkCpValidations(this) ? '-cp-validations' : '';
    return this._super.filesPath.apply(this, [ options ]) + filesPathSuffix;
  }
};
