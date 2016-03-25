import Ember from 'ember';
import AuthApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';

export default Ember.Route.extend(ModalApplicationRouteMixin, AuthApplicationRouteMixin, {
actions: {
invalidateSession: function () {
        this.get('session').invalidate();
}
}
}); 
