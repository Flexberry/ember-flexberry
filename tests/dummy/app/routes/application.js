import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';

export default Ember.Route.extend(ModalApplicationRouteMixin, ApplicationRouteMixin, {
  actions: {
    invalidateSession: function() {
      this.get('session').invalidate();
    }
  }
});
