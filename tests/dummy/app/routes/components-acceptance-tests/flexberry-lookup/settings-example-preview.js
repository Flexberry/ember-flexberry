import { computed } from '@ember/object';
import Builder from 'ember-flexberry-data/query/builder';
import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({

  /**
    Current values name for lookup.

    @property testName
    @type BasePredicate
    @default undefined
   */
  testName: undefined,

  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'PreviewExampleView'
   */
  modelProjection: 'PreviewExampleView',

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
    let store = this.get('store');

    let query = new Builder(store)
      .from('ember-flexberry-dummy-application-user')
      .selectByProjection('PreviewExampleView');

    return store.query('ember-flexberry-dummy-application-user', query.build()).then((suggestionTypes) => {
      let suggestionTypesArr = suggestionTypes.toArray();
      let testValue = suggestionTypesArr.objectAt(0);
      this.set('testName', testValue.get('name'));

      let base = store.createRecord('ember-flexberry-dummy-suggestion', {
        author: testValue,
        editor1: testValue
      });

      let detail = store.createRecord('ember-flexberry-dummy-vote', {
        author: testValue
      });

      base.get('userVotes').pushObject(detail);

      return base;
    });
  },

  /**
    Load limit accessible values for lookup.

    @method setupController
  */
  setupController() {
    this._super(...arguments);

    this.set('controller.testName', this.get('testName'));
  },

  /**
  developerUserSettings.

  @property developerUserSettings
  @type Object
  @default {}
  */
  developerUserSettings: computed(function() {
    return {
      suggestionUserVotesGroupEdit: {
      }
    }
  })
});
