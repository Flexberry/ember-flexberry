import EditFormRoute from 'ember-flexberry/routes/edit-form';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

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

  developerUserSettings: { aggregatorDetailsGroupedit:
    {
      'DEFAULT': {
        'columnWidths': [{ 'propName': 'OlvRowToolbar', 'width': 65 }],
        'sorting': [{ 'propName': 'flag', 'direction': 'desc', 'sortPriority': 1 }]
      }
    }

  },

  /**
    Returns model related to current route.

    @method model
   */
  model(params) {
    var store = this.get('store');

    // Aggregator with two details.
    let agregator = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator', {});
    let detail1 = store.createRecord('components-examples/flexberry-groupedit/shared/detail', {
      id: generateUniqueId(),
      agregator: agregator
    });

    let detail2 = store.createRecord('components-examples/flexberry-groupedit/shared/detail', {
      id: generateUniqueId(),
      agregator: agregator
    });
    Ember.set(agregator, 'details', [detail1, detail2])

    return agregator;
  }
});
