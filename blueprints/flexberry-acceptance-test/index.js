const Blueprint = require('ember-cli/lib/models/blueprint');

const skipConfirmationFunc = require('../utils/skip-confirmation');

module.exports = {
  description: 'Generates acceptance tests for the edit and list forms.',

  availableOptions: [
      { name: 'skip-confirmation', type: Boolean }
  ],

  processFiles(intoDir, templateVariables) {
    let skipConfirmation = this.options.skipConfirmation;
    if (skipConfirmation) {
      return skipConfirmationFunc(this, intoDir, templateVariables);
    }

    return this._super.processFiles.call(this, intoDir, templateVariables);
  },

  locals(options) {
    const blueprint = Blueprint.lookup('acceptance-test', {
      paths: options.project.blueprintLookupPaths(),
    });

    blueprint.project = options.project;

    return blueprint.locals(options);
  }
};
