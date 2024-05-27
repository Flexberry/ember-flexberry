import EditFormRoute from 'ember-flexberry/routes/edit-form';
import { computed } from '@ember/object';
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
    @default 'components-examples/flexberry-groupedit/shared/aggregator'
   */
  modelName: 'components-examples/flexberry-groupedit/shared/aggregator',

  developerUserSettings: computed(function() {
    return { aggregatorDetailsGroupedit:
    {
      'DEFAULT': {
        'columnWidths': [{ 'propName': 'OlvRowToolbar', 'width': 65 }],
        'sorting': [{ 'propName': 'flag', 'direction': 'desc', 'sortPriority': 1 }]
      }
    }

  }}),

  /**
    Returns model related to current route.

    @method model
   */
  /* eslint-disable no-unused-vars */
  model(params) {
    const store = this.get('store');
    let arrRec = [];
    for (let i = 1; i < 10; i++) {
      let newRecord = store.createRecord('components-examples/flexberry-groupedit/shared/detail', {
        text: i + 'test',
        flag: i % 2,
      });
      arrRec.push(newRecord);
    }

    // Aggregator with details.
    const aggregator = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator', { details: arrRec });

    return aggregator;
  }
  /* eslint-enable no-unused-vars */
});
