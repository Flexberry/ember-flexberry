import ModelBlueprint from '../flexberry-model/ModelBlueprint';

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
    return {
      className: modelBlueprint.className,// for use in files\__root__\models\__name__.js
      parentModelName: modelBlueprint.parentModelName,// for use in files\__root__\models\__name__.js
      parentClassName: modelBlueprint.parentClassName,// for use in files\__root__\models\__name__.js
      name: modelBlueprint.name,// for use in files\__root__\models\__name__.js
    };
  }
};
