import Ember from 'ember';

export let separator = ':';

export default {
  mutate: function(id, projection) {
    Ember.assert('id is defined', !!id);
    Ember.assert('projection.name is defined', !!projection.name);
    return id + separator + projection.name + separator;
  },

  retrieve: function(id, type = null) {
    var arr = id.split(separator);
    Ember.assert('id splitted into 3 parts', arr.length === 3);
    var projectionName = arr[1];
    return {
      id: arr[0],
      projectionName: projectionName,
      projection: type ? type.Projections.get(projectionName) : null
    };
  },

  idIsProxied: function(id) {
    return id[id.length - 1] === separator;
  }
};
