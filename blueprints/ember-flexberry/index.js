/* globals module */
module.exports = {
  afterInstall: function () {
    return this.addBowerPackagesToProject([
      { name: 'semantic-ui-daterangepicker', target: '5d46ed2e6e5a0bf398bb6a5df82e06036dfc46be' },
      { name: 'datatables', target: '~1.10.8' }
    ]);
  },

  normalizeEntityName: function () {}
};