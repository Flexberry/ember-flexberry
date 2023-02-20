module.exports = {
  description: 'Adds support for embebr-cp-validations to your app.',

  normalizeEntityName: function() {},

  afterInstall: function () {
    return this.addAddonsToProject({
      packages: [
        { name: 'ember-cp-validations', target: '^3.5.6' },
        { name: 'ember-i18n-cp-validations', target: '^3.1.0' }
      ]
    });
  }
};
