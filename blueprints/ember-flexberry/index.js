/* globals module */
module.exports = {
  afterInstall: function() {
    var _this = this;
    return this.addBowerPackagesToProject([
      { name: 'semantic-ui-daterangepicker', target: '5d46ed2e6e5a0bf398bb6a5df82e06036dfc46be' },
      { name: 'blueimp-file-upload', target: '9.11.2' },
      { name: 'devicejs', target: '0.2.7' }
    ]).then(function() {
      return _this.addAddonsToProject({
        packages: [
          { name: 'semantic-ui-ember', target: '0.9.3' },
          { name: 'ember-moment', target: '6.0.0' }
        ]
      });
    });
  },

  normalizeEntityName: function() {}
};
