import Route from '@ember/routing/route';
import Builder from 'ember-flexberry-data/query/builder';

export default Route.extend({
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
    Current values for lookup.

    @property limitValue
    @type BasePredicate
    @default undefined
   */
  defaultValue: undefined,

  /**
    Returns model related to current route.

    @method model
   */
  model() {
    let store = this.get('store');

    let query = new Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SuggestionTypeE').top(2);

    return store.query('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionTypes) => {
      let suggestionTypesArr = suggestionTypes.toArray();
      this.set('limitValue', suggestionTypesArr.objectAt(0));
      this.set('defaultValue', suggestionTypesArr.objectAt(1));

      let base = store.createRecord('ember-flexberry-dummy-suggestion');
      let readonly = store.createRecord('ember-flexberry-dummy-suggestion');
      let exist = store.createRecord('ember-flexberry-dummy-suggestion', {
        type: suggestionTypesArr.objectAt(1)
      });

      return {
        base: base,
        readonly: readonly,
        exist: exist
      };
    });
  },

  /**
    Load limit accessible values for lookup.

    @method setupController
   */
  setupController() {
    this._super(...arguments);

    this.set('controller.limitValue', this.get('limitValue'));
    this.set('controller.defaultValue', this.get('defaultValue'));
  }
});
