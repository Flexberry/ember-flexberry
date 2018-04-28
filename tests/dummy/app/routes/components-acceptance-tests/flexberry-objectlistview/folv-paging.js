import ListFormRoute from 'ember-flexberry/routes/list-form';
import { computed } from '@ember/object';
export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionL'
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
  @default {}
  */
  developerUserSettings: computed(function() {
    return { FOLVPagingObjectListView: {
    'DEFAULT': {
    'sorting': [
    {
      'propName': 'name',
      'direction': 'asc',
      'sortPriority': 1
    }
    ] }
  } }}),

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion-type',

  /**
    This method will be invoked always when load operation completed,
    regardless of load promise's state (was it fulfilled or rejected).

    @method onModelLoadingAlways.
    @param {Object} data Data about completed load operation.
   */
  /* eslint-disable no-unused-vars */
  onModelLoadingAlways(data) {
    let loadCount = this.get('controller.loadCount') + 1;
    this.set('controller.loadCount', loadCount);
  },
  /* eslint-enable no-unused-vars */
});
