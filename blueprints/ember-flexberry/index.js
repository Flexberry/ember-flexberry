/* globals module */
module.exports = {
  afterInstall: function () {
    this.addBowerPackageToProject('git://github.com/BreadMaker/semantic-ui-daterangepicker.git#5d46ed2e6e5a0bf398bb6a5df82e06036dfc46be');
    this.addBowerPackageToProject('datatables');
  },

  normalizeEntityName: function () {}
};