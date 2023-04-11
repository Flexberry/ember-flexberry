import ListFormRoute from 'ember-flexberry/routes/list-form';
import { computed } from '@ember/object';
export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuccessorL'
   */
  modelProjection: 'SuccessorL',

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
      OLVInheritanceModels: { }
    }
  }),

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'components-examples/flexberry-objectlistview/inheritance-models/successor-social-network'
   */
  modelName: 'ember-flexberry-dummy-successor-social-network'
});
