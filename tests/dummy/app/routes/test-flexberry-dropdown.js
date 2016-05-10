import EditFormRoute from 'ember-flexberry/routes/edit-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default EditFormRoute.extend(AuthenticatedRouteMixin, {
  modelProjection: 'TestAggregatorE',
  modelName: 'test-aggregator',
  model: function(params) {
    var store = this.store;
    return store.createRecord('test-aggregator', {});
  }
});
