import ModelBlueprint from '../flexberry-model/ModelBlueprint';
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
    return {
      className: modelBlueprint.className,// for use in files\__root__\serializers\__name__.js
      parentModelName: modelBlueprint.parentModelName,// for use in files\__root__\serializers\__name__.js
      parentClassName: modelBlueprint.parentClassName,// for use in files\__root__\serializers\__name__.js
      parentExternal: modelBlueprint.parentExternal,// for use in files\__root__\serializers\__name__.js
      name: modelBlueprint.name,// for use in files\__root__\serializers\__name__.js
    };
  }
};
