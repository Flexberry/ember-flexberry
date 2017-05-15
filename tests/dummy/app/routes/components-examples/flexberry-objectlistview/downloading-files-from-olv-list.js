import ListFormRoute from 'ember-flexberry/routes/list-form';

export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionFileE'
   */
  modelProjection: 'SuggestionFileE',

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
  developerUserSettings: { DownloadingFilesFromOLV: { } },

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion-file'
   */
  modelName: 'ember-flexberry-dummy-suggestion-file',

  actions: {
    objectListViewRowClick(record, params) {
      var cellIndex = params.originalEvent.currentTarget.cellIndex;
      var $tBodyTable = $(params.originalEvent.currentTarget.closest('tbody'));
      if ($tBodyTable.find('tr').find('td:eq(0)').hasClass('hidden')) {
        cellIndex--;
      }

      var $table = $(params.originalEvent.currentTarget.closest('table'));
      var nameColumn = $table.find('thead tr').find('th:eq(' + cellIndex + ') div:eq(0) span:eq(0)').text().trim();
      if (nameColumn === 'File') {
        params.goToEditForm = false;
      }

      this._super(...arguments);
    }
  }
});
