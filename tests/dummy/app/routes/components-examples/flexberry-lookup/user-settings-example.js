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
      ApplicationUserObjectlistView: {
        DEFAULT: {
          colsOrder: [
            {
              propName: "name",
              name: "Name"
            },
            {
              propName: "activated",
              hide: true,
              name: "Activated"
            },
            {
              propName: "gender",
              hide: true,
              name: "Gender"
            }
          ]
        }
      }
    });
    this._super(...arguments);
  },
});
