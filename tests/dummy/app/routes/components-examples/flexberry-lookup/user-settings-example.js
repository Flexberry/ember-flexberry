import EditFormRoute from 'ember-flexberry/routes/edit-form';
import Ember from 'ember';
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
   * Returns model related to current route.
   *
   * @param params
   * @function model
   */
  model() {
    const store = Ember.get(this, 'store');
    const base = store.createRecord('ember-flexberry-dummy-suggestion');
    return base;
  },

  init() {
    Ember.set(this, 'developerUserSettings', {
      SuggestionTypeObjectlistView: {
        DEFAULT: {
          colsOrder: [
            {
              propName: "name",
              name: "Name"
            },
            {
              propName: "moderated",
              hide: true,
              name: "Moderated"
            },
            {
              propName: "parent.name",
              hide: true,
              name: "Parent"
            }
          ]
        }
      }
    });
    this._super(...arguments);
  },
});
