import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'AggregatorE'
   */
  modelProjection: 'AggregatorE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'components-examples/flexberry-groupedit/settings-example/aggregator'
   */
  modelName: 'components-examples/flexberry-groupedit/settings-example/aggregator',

  /**
    Returns model related to current route.

    @method model
   */
  model(params) {
    var store = this.get('store');

    // Empty aggregator without details.
    return store.createRecord('components-examples/flexberry-groupedit/settings-example/aggregator', {});
  }
});
