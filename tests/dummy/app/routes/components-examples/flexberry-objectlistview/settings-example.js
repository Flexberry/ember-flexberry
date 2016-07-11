import ListFormRoute from 'ember-flexberry/routes/list-form';

export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionL'
   */
  modelProjection: 'SuggestionL',

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  actions: {
    /**
      Refresh page by call [`refresh`](http://emberjs.com/api/classes/Ember.Route.html#method_refresh) method.

      @method actions.refresh
    */
    refresh() {
      this.refresh();
    },
  },
});
