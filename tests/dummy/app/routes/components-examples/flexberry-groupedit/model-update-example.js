import EditFormRoute from 'ember-flexberry/routes/edit-form';

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

  developerUserSettings: { aggregatorDetailsGroupedit: `
    {
      "DEFAULT": {
        "sorting": [
        {
          "propName": "Flag",
          "direction": "desc",
          "sortPriority": 1
        }
        ]

      }
    }
  `
  },
  /**
    Returns model related to current route.

    @method model
   */
  model(params) {
    let store = this.get('store');

    // Empty aggregator without details.
    return store.createRecord('components-examples/flexberry-groupedit/shared/aggregator', {});
  }
});
