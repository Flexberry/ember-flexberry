/* globals module */
module.exports = {
  afterInstall: function () {
    var _this = this;
    return this.addBowerPackagesToProject([
      { name: 'semantic-ui-daterangepicker', target: '5d46ed2e6e5a0bf398bb6a5df82e06036dfc46be' },
      { name: 'datatables', target: '~1.10.8' }
    ]).then(function() {
      return _this.addAddonsToProject({
        packages: [
          { name: 'ember-cli-simple-auth', target: '0.8.0' },
          { name: 'semantic-ui-ember', target: '0.9.0' }
        ]
      });
    });
  },

  normalizeEntityName: function () {}
};