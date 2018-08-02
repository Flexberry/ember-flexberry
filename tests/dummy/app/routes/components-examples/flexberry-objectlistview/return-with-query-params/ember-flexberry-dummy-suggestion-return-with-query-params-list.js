import ListFormRoute from 'ember-flexberry/routes/list-form';
import ListFormRouteOperationsIndicationMixin from 'dummy/mixins/list-form-route-operations-indication';

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
  @default {}
  */
  developerUserSettings: {
    SuggestionObjectListView: {
      'DEFAULT': {
        'columnWidths': [{ 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 86 }, { 'propName': 'OlvRowMenu', 'fixed': true, 'width': 68 }]
      }
    }
  },

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
    This method will be invoked always when load operation completed,
    regardless of load promise's state (was it fulfilled or rejected).

    @method onModelLoadingAlways.
    @param {Object} data Data about completed load operation.
   */
  onModelLoadingAlways(data) {
    let loadCount = this.get('controller.loadCount') + 1;
    this.set('controller.loadCount', loadCount);
  },
});
