/* globals module */
module.exports = {
  afterInstall: function() {
    var _this = this;
    return this.addBowerPackagesToProject([
      { name: 'semantic-ui-daterangepicker', target: '5d46ed2e6e5a0bf398bb6a5df82e06036dfc46be' },
      { name: 'blueimp-file-upload', target: '9.11.2' },
      { name: 'jquery-file-download', target: '1.4.4' },
      { name: 'malihu-custom-scrollbar-plugin', target: '3.1.3' }
    ]).then(function() {
      // TODO: Since ember-cli 1.13.10 use addAddonsToProject.
      return _this.addAddonToProject({ name: 'semantic-ui-ember', target: '0.9.3' });
    });
  },

  normalizeEntityName: function() {}
};
