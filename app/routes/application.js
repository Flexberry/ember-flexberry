import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  model: function() {
    return this.store.find('context', 0);
  },

  actions: {
    invalidateSession: function() {
      this.get('session').invalidate();
    },

    // Action to show modal-dialog by name.
    showModalDialog: function(modalDialogName, data, modalParams) {
      modalParams = this._getModalParams(modalParams);
      var params = Ember.$.extend({
        into: modalParams.view,
        outlet: modalParams.outlet
      }, data);

      this.render(modalDialogName, params);
    },

    // Action to remove modal outlet on modal-dialog close.
    removeModalDialog: function(modalParams) {
      modalParams = this._getModalParams(modalParams);
      this.disconnectOutlet({
        outlet: modalParams.outlet,
        parentView: modalParams.view
      });
    }
  },

  _getModalParams: function(modalParams) {
    modalParams = modalParams || {};

    var params = {};
    params.outlet = modalParams.outlet || 'modal';
    params.view = modalParams.view || 'application';
    return params;
  }
});
