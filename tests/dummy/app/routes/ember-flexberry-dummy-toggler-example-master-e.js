import EditFormRoute from 'ember-flexberry/routes/edit-form';
import { computed } from '@ember/object';
export default EditFormRoute.extend({

  /**
   Name of model projection to be used as record's properties limitation.

   @property modelProjection
   @type String
   @default 'TogglerExampleMasterE'
   */
  modelProjection: 'TogglerExampleMasterE',

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
  developerUserSettings: computed(function() {
    return {
    togglerExampleDetailGroupEdit: {
      'DEFAULT': {
        'columnWidths': [
          { 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 65 },
          { 'propName': 'togglerExampleDetailProperty', 'width': 935 }]
      }
    }
  }}),

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-toggler-example-master'
  */
  modelName: 'ember-flexberry-dummy-toggler-example-master'
});
