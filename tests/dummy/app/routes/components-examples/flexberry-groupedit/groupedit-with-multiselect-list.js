import ListFormRoute from 'ember-flexberry/routes/list-form';
import ListFormRouteOperationsIndicationMixin from 'dummy/mixins/list-form-route-operations-indication';
import { computed } from '@ember/object';
export default ListFormRoute.extend(ListFormRouteOperationsIndicationMixin, {
  /**
   Name of model projection to be used as record's properties limitation.

   @property modelProjection
   @type String
   @default 'SuggestionL'
   */
  modelProjection: 'SuggestionL',

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

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion'
});
