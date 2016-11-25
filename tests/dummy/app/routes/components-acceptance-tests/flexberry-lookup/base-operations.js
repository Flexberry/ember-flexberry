import EditFormRoute from 'ember-flexberry/routes/edit-form';
import { Query } from 'ember-flexberry-data';

const { StringPredicate } = Query;

export default EditFormRoute.extend({
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
  /*model(params) {
    let store = this.get('store');

    let query = new Query.Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SuggestionTypeE');

    return store.query('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionTypes) => {
      let suggestionTypesArr = suggestionTypes.toArray();
      let suggestion = suggestionTypesArr.objectAt(0);
      let base = store.createRecord('ember-flexberry-dummy-suggestion-type');
      base.set('type',suggestion);
      return base;
    });
  }*/

  model(params) {
    let store = this.get('store');

    let base = store.createRecord('ember-flexberry-dummy-suggestion');
    return base;
  }
});
