import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  modelProjection: 'TestAggregatorE',
  modelName: 'test-aggregator',
  model: function(params) {
    var store = this.store;
    return store.createRecord('test-aggregator', {});
  }
});
