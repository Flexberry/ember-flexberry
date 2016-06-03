import Ember from 'ember';

export default Ember.Route.extend({
  modelProjection: 'BaseE',
  modelName: 'integration-examples/validations/different-components-integration/base',
  model(params) {
    let store = this.get('store');
    let base = store.createRecord('integration-examples/validations/different-components-integration/base', {});

    return base;
  }
});