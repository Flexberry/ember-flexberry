import ListFormRoute from 'ember-flexberry/routes/list-form';
import { computed } from '@ember/object';
export default ListFormRoute.extend({

  modelProjection: 'SuggestionL',

  developerUserSettings: computed(function() {
    return { ObjectListViewResize: { } }}),

  modelName: 'ember-flexberry-dummy-suggestion',

  model: function () {
    return this.store.findAll('ember-flexberry-dummy-suggestion').then(posts => posts.toArray());
  }
});
