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

    // action to show modal-dialog by name
    showModalDialog: function (modalDialogName, data) {
      var params = Ember.$.extend({
        into: 'application',
        outlet: 'modal'
      }, data);

      this.render(modalDialogName, params);
    },

    // action to remove modal outlet on modal-dialog close
    removeModalDialog: function() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
