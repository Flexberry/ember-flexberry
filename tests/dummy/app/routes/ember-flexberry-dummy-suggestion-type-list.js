import { computed } from '@ember/object';
import ListFormRoute from 'ember-flexberry/routes/list-form';
export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionTypeL'
   */
  modelProjection: 'SuggestionTypeL',

  /**
  developerUserSettings.
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
      SOLVSuggestionTypeObjectListView: {
        'DEFAULT': {
          'columnWidths': [{ 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 90 }, { 'propName': 'OlvRowMenu', 'fixed': true, 'width': 68 }]
        }
      }
    }
  }),

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion-type'
   */
  modelName: 'ember-flexberry-dummy-suggestion-type'
});
