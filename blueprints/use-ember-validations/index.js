module.exports = {
  description: 'Adds support for embebr-validations to your app.',

  normalizeEntityName: function() {},

  afterInstall: function () {
    return this.addAddonsToProject({
      packages: [
        { name: 'ember-validations', target: '~2.0.0-alpha.5' }
      ]
    });
  }
};
