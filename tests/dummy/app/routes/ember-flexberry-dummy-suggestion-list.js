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
  componentName to be user for userSettings

  @property componentName
  @type String
  @default 'SuggestionObjectListView'
  */
  componentName: 'SuggestionObjectListView',

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion'
});
