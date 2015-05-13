import Ember from 'ember';

export let separator = ':';

export default {
  mutate: function(id, view) {
    Ember.assert('id is defined', !!id);
    Ember.assert('view.name is defined', !!view.name);
    return id + separator + view.name + separator;
  },

  retrieve: function(id, type = null) {
    var arr = id.split(separator);
    Ember.assert('id splitted into 3 parts', arr.length === 3);
    var viewName = arr[1];
    return {
      id: arr[0],
      viewName: viewName,
      view: type ? type.Views[viewName] : null
    };
  },

  idIsProxied: function(id) {
    return id[id.length - 1] === separator;
  }
};
