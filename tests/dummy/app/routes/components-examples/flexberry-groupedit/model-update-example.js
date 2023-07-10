import EditFormRoute from 'ember-flexberry/routes/edit-form';
import { computed } from '@ember/object';
export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ManualModelUpdateView'
   */
  modelProjection: 'ManualModelUpdateView',

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
        'columnWidths': [{ 'propName': 'OlvRowToolbar', 'width': 100 }],
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
    let store = this.get('store');

    // Empty aggregator without details.
    return store.createRecord('components-examples/flexberry-groupedit/shared/aggregator', {});
  }
  /* eslint-enable no-unused-vars */
});
