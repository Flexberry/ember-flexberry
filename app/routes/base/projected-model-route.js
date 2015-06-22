import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  modelProjection: undefined,
  // TODO: really needed? maybe it is possible to get type from current route?
  modelTypeKey: undefined
});