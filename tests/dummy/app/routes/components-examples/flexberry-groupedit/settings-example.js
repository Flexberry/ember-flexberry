import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  modelProjection: 'AggregatorE',
  modelName: 'components-examples/flexberry-groupedit/settings-example/aggregator',
  model: function() {
    var store = this.get('store');

    // Empty aggregator without details.
    return store.createRecord('components-examples/flexberry-groupedit/settings-example/aggregator', {});
  }
});
