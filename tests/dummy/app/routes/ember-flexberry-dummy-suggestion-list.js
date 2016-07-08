import ListFormRoute from 'ember-flexberry/routes/list-form';

export default ListFormRoute.extend({
  /**
   N ame of model projection to b*e used as record's properties limitation.

   @property modelProjection
   @type String
   @default 'SuggestionL'
   */
  modelProjection: 'SuggestionL',

  /**
  userSettings.
  Format:
  {
    <componentName>: {
      colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
      sorting: [{ propName: <colName>, direction: "asc"|"desc" }, ... ],
      colsWidths: [ <colName>:<colWidth>, ... ],
    },
  ...
  }

  @property userSettings
  @type Object
  @default {}
  */
  userSettings: { SuggestionObjectListView: { } },

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion'
});
