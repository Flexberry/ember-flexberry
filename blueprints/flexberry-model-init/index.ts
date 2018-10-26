import ModelBlueprint from '../flexberry-model/ModelBlueprint';

module.exports = {

  description: 'Generates an ember-data model for flexberry.',

  availableOptions: [
    { name: 'file', type: String },
    { name: 'metadata-dir', type: String }
  ],

  supportsAddon: function () {
    return false;
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
    return {
      namespace: modelBlueprint.namespace,// for use in files\__root__\models\__name__.js
      className: modelBlueprint.className,// for use in files\__root__\models\__name__.js
      parentModelName: modelBlueprint.parentModelName,// for use in files\__root__\models\__name__.js
      parentClassName: modelBlueprint.parentClassName,// for use in files\__root__\models\__name__.js
      parentExternal: modelBlueprint.parentExternal,// for use in files\__root__\models\__name__.js
      name: modelBlueprint.name,// for use in files\__root__\models\__name__.js
      projections: modelBlueprint.projections,// for use in files\__root__\models\__name__.js
    };
  }
};
