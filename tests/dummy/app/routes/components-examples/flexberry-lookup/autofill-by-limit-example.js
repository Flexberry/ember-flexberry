import EditFormRoute from 'ember-flexberry/routes/edit-form';
import Builder from 'ember-flexberry-data/query/builder';

export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'LookupWithLimitFunctionExampleView'
   */
  modelProjection: 'LookupWithLimitFunctionExampleView',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
    Current predicate to limit values for lookup.

    @property limitValue
    @type BasePredicate
    @default undefined
   */
  limitValue: undefined,

  /**
    Returns model related to current route.

    @method model
   */
  model() {
    let store = this.get('store');

    let query = new Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SuggestionTypeE');

    return store.queryRecord('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionType) => {
      this.set('limitValue', suggestionType);

      let base = store.createRecord('ember-flexberry-dummy-suggestion');
      return base;
    });
  },

  /**
    Load limit accessible values for lookup.

    @method setupController
   */
  setupController() {
    this._super(...arguments);

    this.set('controller.limitValue', this.get('limitValue'));
  }
});
