import Builder from 'ember-flexberry-data/query/builder';
import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({

  /**
    Current predicate to limit accessible values for lookup.

    @property limitType
    @type BasePredicate
    @default undefined
   */
  limitType: undefined,
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SettingLookupExampleView'
   */
  modelProjection: 'SettingLookupExampleView',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
    Returns model related to current route.

    @method model
   */
  /* eslint-disable no-unused-vars */
  model(params) {
    let store = this.get('store');

    let query = new Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SettingLookupExampleView');

    return store.query('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionTypes) => {
      let suggestionTypesArr = suggestionTypes.toArray();
      this.set('limitType', suggestionTypesArr.objectAt(0).get('name'));

      let base = store.createRecord(this.get('modelName'));
      return base;
    });

  },
  /* eslint-enable no-unused-vars */

  /**
    Load limit accessible values for lookup.

    @method setupController
   */
  setupController() {
    this._super(...arguments);

    this.set('controller.limitType', this.get('limitType'));
  }
});
