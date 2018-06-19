import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import { computed } from '@ember/object';
export default EditFormNewRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'TogglerExampleMasterE'
  */
  modelProjection: 'TogglerExampleMasterE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-toggler-example-master'
  */
  modelName: 'ember-flexberry-dummy-toggler-example-master',

  /**
    Name of template to be rendered.

    @property templateName
    @type String
    @default 'ember-flexberry-dummy-toggler-example-master-e'
  */
  templateName: 'ember-flexberry-dummy-toggler-example-master-e',

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
      togglerExampleDetailGroupEdit: {
        'DEFAULT': {
          'columnWidths': [
            { 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 65 },
            { 'propName': 'togglerExampleDetailProperty', 'width': 935 }]
        }
      }
    }
  }),
});
