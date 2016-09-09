/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

import ModelBlueprint from './ModelBlueprint';
import lodash = require('lodash');

module.exports = {

  description: 'Generates an ember-data model for flexberry.',

  availableOptions: [
    { name: 'file', type: String },
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
   * @return {Object} Custom template variables.
   */
  locals: function(options) {
    let modelBlueprint = new ModelBlueprint(this, options);
    return lodash.defaults({
      parentModelName: modelBlueprint.parentModelName,//
      parentClassName: modelBlueprint.parentClassName,//
      model: modelBlueprint.model,// for use in files\__root__\mixins\regenerated\models\__name__.js
      validations: modelBlueprint.validations,// for use in files\__root__\mixins\regenerated\models\__name__.js
      projections: modelBlueprint.projections,// for use in files\__root__\mixins\regenerated\models\__name__.js
      serializerAttrs: modelBlueprint.serializerAttrs,// for use in files\__root__\mixins\regenerated\serializers\__name__.js
      name: modelBlueprint.name,// for use in files\tests\unit\models\__name__.js, files\tests\unit\serializers\__name__.js
      needsAllModels: modelBlueprint.needsAllModels,// for use in files\tests\unit\models\__name__.js, files\tests\unit\serializers\__name__.js
      needsAllEnums: modelBlueprint.needsAllEnums// for use in files\tests\unit\serializers\__name__.js
      },
      modelBlueprint.lodashVariables
    );
  }
};
