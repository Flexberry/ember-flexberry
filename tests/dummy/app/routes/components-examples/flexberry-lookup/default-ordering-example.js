import EditFormRoute from 'ember-flexberry/routes/edit-form';
import { computed } from '@ember/object';
export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'DropDownLookupExampleView'
   */
  modelProjection: 'DefaultOrderingExampleView',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
  developerUserSettings.
  {
  <componentName>: {
    <settingName>: {
        sorting: [{ propName: <colName>, direction: 'asc'|'desc' }, ... ]
      },
      ...
    },
    ...
  }
  For default userSetting use empty name ('').
  <componentName> may contain any of properties: sorting.

  @property developerUserSettings
  @type Object
  */
  developerUserSettings: computed(function() {
    return {
      lookupUserSettings: {
        'DEFAULT': {
          'sorting': [
            { 'propName': 'name', 'direction': 'desc' },
            { 'propName': 'moderated', 'direction': 'asc' }
          ]
        }
      }
    }
  }),
  /**
    Returns model related to current route.

    @method model
   */
  /* eslint-disable no-unused-vars */
  model(params) {
    let store = this.get('store');
    let base = store.createRecord('ember-flexberry-dummy-suggestion');
    return base;
  }
  /* eslint-enable no-unused-vars */
});
