import Ember from 'ember';
import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SettingLookupExampleView'
   */
  modelProjection: 'SuggestionE',

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
  model() {
    let store = Ember.get(this, 'store');
    let suggestion = store.createRecord('ember-flexberry-dummy-suggestion', {
      name: 'TestSuggestionName'
    });
    store.createRecord('ember-flexberry-dummy-vote', {
      suggestion: suggestion
    });
    store.createRecord('ember-flexberry-dummy-comment', {
      suggestion: suggestion,
      text: 'Test comment'
    });

    return suggestion;
  }
});
