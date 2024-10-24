import EditFormRoute from 'ember-flexberry/routes/edit-form';
export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ConfigurateRowView'
  */
  modelProjection: 'ManualModelUpdateView',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'components-examples/flexberry-groupedit/shared/aggregator'
  */
  modelName: 'components-examples/flexberry-groupedit/shared/aggregator',

  /**
    Returns model related to current route.

    @method model
  */
  model() {
    let store = this.get('store');

    let arrRec = [];
    for (let i = 1; i < 10; i++) {
      let newRecord = store.createRecord('components-examples/flexberry-groupedit/shared/detail', {
        text: i + 'test',
        flag: i % 2
      });
      arrRec.push(newRecord);
    }

    // Aggregator with details.
    let aggregator = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator', { details: arrRec });
    return aggregator;
  }
});
