import ListFormRoute from 'ember-flexberry/routes/list-form';
import ListFormRouteOperationsIndicationMixin from '../mixins/list-form-route-operations-indication';
import { computed } from '@ember/object';
export default ListFormRoute.extend(ListFormRouteOperationsIndicationMixin, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'LocalizationL'
   */
  modelProjection: 'LocalizationL',

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
      localizationObjectListView: { }
    }
  }),

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-localization'
   */
  modelName: 'ember-flexberry-dummy-localization'
});
