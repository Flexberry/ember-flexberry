import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

// TODO: split auth\modal logic into separate classes and move to addon.
export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    invalidateSession: function() {
      this.get('session').invalidate();
    },

    // Action to show modal-dialog by name.
    showModalDialog: function(modalDialogName, data) {
      var params = Ember.$.extend({
        into: 'application',
        outlet: 'modal'
      }, data);

      this.render(modalDialogName, params);
    },

    // Action to remove modal outlet on modal-dialog close.
    removeModalDialog: function() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
