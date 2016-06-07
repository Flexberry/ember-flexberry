import Ember from 'ember';

export default Ember.Route.extend({
  modelProjection: 'AggregatorE',
  modelName: 'integration-examples/edit-form/readonly-mode/aggregator',
  model(params) {
    let store = this.get('store');
    let base = store.createRecord('integration-examples/edit-form/readonly-mode/aggregator', {});

    return base;
  }
});
