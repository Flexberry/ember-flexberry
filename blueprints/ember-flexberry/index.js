/* globals module */
module.exports = {
  afterInstall: function () {
    return this.addBowerPackageToProject('semantic-ui-daterangepicker');
    return this.addBowerPackageToProject('datatables');
  },

  normalizeEntityName: function () {}
};