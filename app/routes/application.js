import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    model: function() {
        return this.store.find('application', 0);
    },

    actions: {
        invalidateSession: function() {
            this.get('session').invalidate();
        }
    }
});
