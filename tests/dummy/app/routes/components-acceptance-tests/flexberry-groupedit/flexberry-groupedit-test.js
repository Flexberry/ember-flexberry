import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend( {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionE'
   */
  modelProjection: 'SuggestionE',

  /**
  developerUserSettings.
  {
  <componentName>: {
    <settingName>: {
        colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
        sorting: [{ propName: <colName>, direction: 'asc'|'desc' }, ... ],
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
    suggestionUserVotesGroupEdit: {
      'DEFAULT': {
        'columnWidths': [{ 'propName': 'voteType', 'width': 133 }, { 'propName': 'author', 'width': 348 }, { 'propName': 'author.eMail', 'width': 531 }]
      }
    },
    filesGroupEdit: {
      'DEFAULT': {
        'columnWidths': [{ 'propName': 'order', 'width': 140 }, { 'propName': 'file', 'width': 893 }],
        'colsOrder': [{ 'propName': 'file' }, { 'propName': 'order' }]
      }
    }
  },

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion'
});
