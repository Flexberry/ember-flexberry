import ListFormRoute from 'ember-flexberry/routes/list-form';

export default ListFormRoute.extend({

  modelProjection: 'SuggestionL',

  developerUserSettings: { ObjectListViewResize: { } },

  modelName: 'ember-flexberry-dummy-suggestion',

  model: function () {
    return this.store.findAll('ember-flexberry-dummy-suggestion').then(posts => posts.toArray());
  }
});
