import { computed } from '@ember/object';
import ListFormRoute from 'ember-flexberry/routes/list-form';

export default ListFormRoute.extend({

  modelProjection: 'SuggestionE',

  /**
  developerUserSettings.
  Format:
  {
  <componentName>: {
    <settingName>: {
        colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
        sorting: [{ propName: <colName>, direction: "asc"|"desc" }, ... ],
        colsWidths: [ <colName>:<colWidth>, ... ],
      },
      ...
    },
    ...
  }
  For default userSetting use empty name ('').
  <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.

  @property developerUserSettings
  @type Object
  */
  developerUserSettings: computed(function() {
    return {
      SuggestionObjectListView: {
        'DEFAULT': {
          'columnWidths': [{ 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 90 }, { 'propName': 'OlvRowMenu', 'fixed': true, 'width': 68 }]
        }
      }
    }
  }),

  modelName: 'ember-flexberry-dummy-suggestion'
});
