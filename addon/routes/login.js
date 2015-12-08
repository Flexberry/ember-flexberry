import Ember from 'ember';
import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  // clear a potentially stale error message from previous login attempts
  setupController: function(controller, model) {
    controller.set('errorMessage', null);
  }
});
